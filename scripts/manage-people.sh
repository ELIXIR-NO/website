#!/usr/bin/env bash
# Manage src/data/people.json and public/data/people/
#
# Run from anywhere inside the repo:
#   bash scripts/manage-people.sh
#
# Requires: jq (sudo apt install jq  |  brew install jq)
#           bash >= 4  (macOS: brew install bash)

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PEOPLE_JSON="$REPO_ROOT/src/data/people.json"
PEOPLE_DIR="$REPO_ROOT/src/data/people"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

die() { echo -e "${RED}Error: $*${NC}" >&2; exit 1; }

# ── Globals used as "return values" from selection helpers ──────────────────
SELECTED_ORG=""      # set by select_org()
SELECTED_INDEX=""    # set by select_person()
COPIED_FILENAME=""   # set by copy_photo()
GROUPS_RESULT="[]"   # set by manage_groups()

# ── Setup ───────────────────────────────────────────────────────────────────

check_deps() {
    (( BASH_VERSINFO[0] >= 4 )) \
        || die "Bash 4+ required. On macOS run: brew install bash"
    command -v jq &>/dev/null \
        || die "jq is required. Install: sudo apt install jq  |  brew install jq"
    [[ -f "$PEOPLE_JSON" ]] \
        || die "people.json not found at $PEOPLE_JSON"
    [[ -d "$PEOPLE_DIR" ]] \
        || die "src/data/people directory not found at $PEOPLE_DIR"
}

write_json() {
    local file="$1"
    local tmp
    tmp=$(mktemp "$(dirname "$file")/.tmp.XXXXXX")
    cat > "$tmp"
    mv "$tmp" "$file"
}

# ── Selection helpers ────────────────────────────────────────────────────────

# Prompts the user to select an organisation.
# Sets SELECTED_ORG. Returns 1 if the user cancels.
# Pass "true" as $1 to include a "New organisation" option.
select_org() {
    local include_new="${1:-false}"
    SELECTED_ORG=""

    local -a org_keys
    mapfile -t org_keys < <(jq -r '.orgs | keys[]' "$PEOPLE_JSON")

    echo -e "${BOLD}Organisations:${NC}"
    local i=0
    for key in "${org_keys[@]}"; do
        local name count
        name=$(jq -r --arg k "$key" '.orgs[$k].name' "$PEOPLE_JSON")
        count=$(jq --arg k "$key" '.orgs[$k].people | length' "$PEOPLE_JSON")
        printf "  %2d)  %-52s [%s — %d people]\n" "$i" "$name" "$key" "$count"
        i=$((i + 1))
    done

    if [[ "$include_new" == "true" ]]; then
        printf "  %2d)  New organisation\n" "$i"
    fi

    echo
    read -rp "Choice (or q to cancel): " choice
    [[ "$choice" == "q" ]] && return 1

    if [[ "$include_new" == "true" ]] && [[ "$choice" -eq "${#org_keys[@]}" ]]; then
        SELECTED_ORG="__new__"
        return 0
    fi

    if ! [[ "$choice" =~ ^[0-9]+$ ]] || [[ "$choice" -ge "${#org_keys[@]}" ]]; then
        echo -e "${RED}Invalid choice.${NC}"; return 1
    fi

    SELECTED_ORG="${org_keys[$choice]}"
}

# Prompts the user to select a person within an org.
# Sets SELECTED_INDEX. Returns 1 if the user cancels or the org is empty.
select_person() {
    local org_key="$1"
    SELECTED_INDEX=""

    local count
    count=$(jq --arg org "$org_key" '.orgs[$org].people | length' "$PEOPLE_JSON")

    if [[ "$count" -eq 0 ]]; then
        echo -e "${YELLOW}No people in this organisation.${NC}"; return 1
    fi

    echo -e "${BOLD}People:${NC}"
    jq -r --arg org "$org_key" \
       '.orgs[$org].people | to_entries[] | "  [\(.key)]  \(.value.name)  —  \(.value.title)"' \
       "$PEOPLE_JSON"

    echo
    read -rp "Choice (or q to cancel): " choice
    [[ "$choice" == "q" ]] && return 1

    if ! [[ "$choice" =~ ^[0-9]+$ ]] || [[ "$choice" -ge "$count" ]]; then
        echo -e "${RED}Invalid choice.${NC}"; return 1
    fi

    SELECTED_INDEX="$choice"
}

# Copies a photo to PEOPLE_DIR.
# Sets COPIED_FILENAME on success. Returns 1 on failure.
copy_photo() {
    local src="$1"
    src="${src/#\~/$HOME}"
    COPIED_FILENAME=""

    [[ -f "$src" ]] || { echo -e "${RED}File not found: $src${NC}"; return 1; }

    local filename
    filename=$(basename "$src")
    local dest="$PEOPLE_DIR/$filename"

    if [[ -f "$dest" ]]; then
        echo -e "${YELLOW}$filename already exists in src/data/people/.${NC}"
        read -rp "Overwrite? (y/N): " ow
        [[ "${ow,,}" == "y" ]] || return 1
    fi

    cp "$src" "$dest"
    COPIED_FILENAME="$filename"
    echo -e "${GREEN}Photo saved as $filename.${NC}"
}

# Interactive loop to manage an elixir-groups array.
# Pass the current JSON array as $1 (e.g. '[]' or '[{"name":"coordinators","role":null}]').
# Sets GROUPS_RESULT with the final array.
manage_groups() {
    local current="${1:-[]}"
    GROUPS_RESULT="$current"

    local -a group_names
    mapfile -t group_names < <(jq -r '.groups[].name' "$PEOPLE_JSON")

    while true; do
        local count
        count=$(jq 'length' <<<"$GROUPS_RESULT")

        echo
        echo -e "${BOLD}Current ELIXIR group memberships:${NC}"
        if [[ "$count" -eq 0 ]]; then
            echo "  (none)"
        else
            jq -r 'to_entries[] |
                "  [\(.key)]  \(.value.name)\(if .value.role then "  (\(.value.role))" else "" end)"' \
                <<<"$GROUPS_RESULT"
        fi

        echo
        echo "  a) Add to a group"
        echo "  r) Remove from a group"
        echo "  c) Clear all"
        echo "  d) Done"
        read -rp "Action: " action

        case "$action" in
            a)
                echo
                echo -e "${BOLD}Available groups:${NC}"
                jq -r '.groups | to_entries[] |
                    "  [\(.key)]  \(.value.name)  —  \(.value.description)"' \
                    "$PEOPLE_JSON"
                echo
                read -rp "Select group (index): " gi
                if ! [[ "$gi" =~ ^[0-9]+$ ]] || [[ "$gi" -ge "${#group_names[@]}" ]]; then
                    echo -e "${RED}Invalid index.${NC}"; continue
                fi
                local gname="${group_names[$gi]}"
                read -rp "Role in this group (leave blank for none): " grole
                local entry
                if [[ -z "$grole" ]]; then
                    entry=$(jq -n --arg g "$gname" '{"name": $g, "role": null}')
                else
                    entry=$(jq -n --arg g "$gname" --arg r "$grole" '{"name": $g, "role": $r}')
                fi
                GROUPS_RESULT=$(jq --argjson e "$entry" '. += [$e]' <<<"$GROUPS_RESULT")
                echo -e "${GREEN}Added to $gname.${NC}"
                ;;
            r)
                [[ "$count" -gt 0 ]] || { echo -e "${YELLOW}No memberships to remove.${NC}"; continue; }
                read -rp "Index to remove: " ri
                if ! [[ "$ri" =~ ^[0-9]+$ ]] || [[ "$ri" -ge "$count" ]]; then
                    echo -e "${RED}Invalid index.${NC}"; continue
                fi
                GROUPS_RESULT=$(jq --argjson i "$ri" 'del(.[$i])' <<<"$GROUPS_RESULT")
                echo -e "${GREEN}Removed.${NC}"
                ;;
            c)
                GROUPS_RESULT="[]"
                echo -e "${GREEN}Cleared.${NC}"
                ;;
            d)
                break
                ;;
            *)
                echo -e "${RED}Unknown action.${NC}"
                ;;
        esac
    done
}

# ── Main operations ──────────────────────────────────────────────────────────

list_people() {
    echo -e "${BOLD}--- All People ---${NC}"
    echo

    local -a org_keys
    mapfile -t org_keys < <(jq -r '.orgs | keys[]' "$PEOPLE_JSON")

    for key in "${org_keys[@]}"; do
        local name count
        name=$(jq -r --arg k "$key" '.orgs[$k].name' "$PEOPLE_JSON")
        count=$(jq --arg k "$key" '.orgs[$k].people | length' "$PEOPLE_JSON")
        echo -e "${CYAN}${BOLD}$name${NC}  ($count people)"
        jq -r --arg k "$key" \
           '.orgs[$k].people[] | "  \(.name)  —  \(.title)"' \
           "$PEOPLE_JSON"
        echo
    done
}

add_person() {
    echo -e "${BOLD}--- Add Person ---${NC}"
    echo

    select_org "true" || return
    local org_key="$SELECTED_ORG"

    if [[ "$org_key" == "__new__" ]]; then
        read -rp "Organisation key (short ID, e.g. 'sintef'): " org_key
        if jq -e --arg k "$org_key" '.orgs[$k]' "$PEOPLE_JSON" &>/dev/null; then
            echo -e "${YELLOW}Organisation '$org_key' already exists. Adding person to it.${NC}"
        else
            local org_name
            read -rp "Organisation full name: " org_name
            jq --arg k "$org_key" --arg n "$org_name" \
               '.orgs[$k] = {"name": $n, "people": []}' \
               "$PEOPLE_JSON" | write_json "$PEOPLE_JSON"
            echo -e "${GREEN}Organisation '$org_name' created.${NC}"
        fi
    fi

    echo
    local name title profile_url raw_photo
    read -rp "Full name: " name
    read -rp "Title / position: " title
    read -rp "Profile URL (leave blank for none): " profile_url

    echo
    read -rp "Path to photo (leave blank to skip): " raw_photo

    local photo_json="null"
    if [[ -n "$raw_photo" ]]; then
        if copy_photo "$raw_photo"; then
            photo_json=$(jq -n --arg v "/data/people/$COPIED_FILENAME" '$v')
        fi
    fi

    local profile_json="null"
    [[ -n "$profile_url" ]] && profile_json=$(jq -n --arg v "$profile_url" '$v')

    echo
    echo "ELIXIR group memberships:"
    manage_groups "[]"
    local groups_json="$GROUPS_RESULT"

    jq --arg org "$org_key" \
       --arg name "$name" \
       --arg title "$title" \
       --argjson profile "$profile_json" \
       --argjson photo "$photo_json" \
       --argjson groups "$groups_json" \
       '.orgs[$org].people += [{
           "name": $name,
           "title": $title,
           "photo": $photo,
           "profile-url": $profile,
           "affiliations": [],
           "elixir-groups": $groups
       }]' \
       "$PEOPLE_JSON" | write_json "$PEOPLE_JSON"

    echo
    echo -e "${GREEN}Added: $name${NC}"
}

remove_person() {
    echo -e "${BOLD}--- Remove Person ---${NC}"
    echo

    select_org || return
    echo
    select_person "$SELECTED_ORG" || return

    local person_name
    person_name=$(jq -r --arg org "$SELECTED_ORG" --argjson i "$SELECTED_INDEX" \
        '.orgs[$org].people[$i].name' "$PEOPLE_JSON")

    echo
    read -rp "Remove \"$person_name\"? (y/N): " confirm
    [[ "${confirm,,}" == "y" ]] || { echo "Cancelled."; return; }

    jq --arg org "$SELECTED_ORG" --argjson i "$SELECTED_INDEX" \
       'del(.orgs[$org].people[$i])' \
       "$PEOPLE_JSON" | write_json "$PEOPLE_JSON"

    echo -e "${GREEN}$person_name removed.${NC}"
}

update_person() {
    echo -e "${BOLD}--- Update Person ---${NC}"
    echo

    select_org || return
    local org="$SELECTED_ORG"
    echo
    select_person "$org" || return
    local idx="$SELECTED_INDEX"

    local person_name
    person_name=$(jq -r --arg org "$org" --argjson i "$idx" \
        '.orgs[$org].people[$i].name' "$PEOPLE_JSON")

    echo
    echo -e "Editing: ${BOLD}$person_name${NC}"
    echo
    echo "  1) Name"
    echo "  2) Title"
    echo "  3) Photo"
    echo "  4) Profile URL"
    echo "  5) ELIXIR group memberships"
    echo
    read -rp "What to update: " field

    case "$field" in
        1)
            local current
            current=$(jq -r --arg org "$org" --argjson i "$idx" \
                '.orgs[$org].people[$i].name' "$PEOPLE_JSON")
            echo "Current: $current"
            read -rp "New name: " new_val
            jq --arg org "$org" --argjson i "$idx" --arg v "$new_val" \
               '.orgs[$org].people[$i].name = $v' "$PEOPLE_JSON" | write_json "$PEOPLE_JSON"
            echo -e "${GREEN}Name updated.${NC}"
            ;;
        2)
            local current
            current=$(jq -r --arg org "$org" --argjson i "$idx" \
                '.orgs[$org].people[$i].title' "$PEOPLE_JSON")
            echo "Current: $current"
            read -rp "New title: " new_val
            jq --arg org "$org" --argjson i "$idx" --arg v "$new_val" \
               '.orgs[$org].people[$i].title = $v' "$PEOPLE_JSON" | write_json "$PEOPLE_JSON"
            echo -e "${GREEN}Title updated.${NC}"
            ;;
        3)
            local raw_path
            read -rp "Path to new photo: " raw_path
            copy_photo "$raw_path" || return
            local photo_val
            photo_val=$(jq -n --arg v "/data/people/$COPIED_FILENAME" '$v')
            jq --arg org "$org" --argjson i "$idx" --argjson v "$photo_val" \
               '.orgs[$org].people[$i].photo = $v' "$PEOPLE_JSON" | write_json "$PEOPLE_JSON"
            echo -e "${GREEN}Photo updated.${NC}"
            ;;
        4)
            local current
            current=$(jq -r --arg org "$org" --argjson i "$idx" \
                '.orgs[$org].people[$i]["profile-url"] // "(none)"' "$PEOPLE_JSON")
            echo "Current: $current"
            read -rp "New URL (leave blank to clear): " new_val
            if [[ -z "$new_val" ]]; then
                jq --arg org "$org" --argjson i "$idx" \
                   '.orgs[$org].people[$i]["profile-url"] = null' \
                   "$PEOPLE_JSON" | write_json "$PEOPLE_JSON"
            else
                local profile_val
                profile_val=$(jq -n --arg v "$new_val" '$v')
                jq --arg org "$org" --argjson i "$idx" --argjson v "$profile_val" \
                   '.orgs[$org].people[$i]["profile-url"] = $v' \
                   "$PEOPLE_JSON" | write_json "$PEOPLE_JSON"
            fi
            echo -e "${GREEN}Profile URL updated.${NC}"
            ;;
        5)
            local current_groups
            current_groups=$(jq -c --arg org "$org" --argjson i "$idx" \
                '.orgs[$org].people[$i]["elixir-groups"]' "$PEOPLE_JSON")
            manage_groups "$current_groups"
            jq --arg org "$org" --argjson i "$idx" --argjson g "$GROUPS_RESULT" \
               '.orgs[$org].people[$i]["elixir-groups"] = $g' \
               "$PEOPLE_JSON" | write_json "$PEOPLE_JSON"
            echo -e "${GREEN}ELIXIR groups updated.${NC}"
            ;;
        *)
            echo -e "${RED}Invalid choice.${NC}"
            ;;
    esac
}

# ── Entry point ──────────────────────────────────────────────────────────────

main() {
    check_deps
    echo
    echo -e "${BOLD}${CYAN}=== ELIXIR Norway — People Manager ===${NC}"
    echo

    while true; do
        echo "  a) Add person"
        echo "  r) Remove person"
        echo "  u) Update person"
        echo "  l) List all people"
        echo "  q) Quit"
        echo
        read -rp "Action: " action
        echo

        case "$action" in
            a) add_person ;;
            r) remove_person ;;
            u) update_person ;;
            l) list_people ;;
            q) echo "Bye."; exit 0 ;;
            *) echo -e "${RED}Unknown action. Choose a, r, u, l, or q.${NC}" ;;
        esac
        echo
    done
}

main
