#!/usr/bin/env bash
# Manage src/data/slides.json and public/data/slides/
#
# Run from anywhere inside the repo:
#   bash scripts/manage-slides.sh
#
# Requires: jq (sudo apt install jq  |  brew install jq)
#           bash >= 4  (macOS: brew install bash)

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SLIDES_JSON="$REPO_ROOT/src/data/slides.json"
SLIDES_DIR="$REPO_ROOT/src/data/slides"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

die() { echo -e "${RED}Error: $*${NC}" >&2; exit 1; }

check_deps() {
    (( BASH_VERSINFO[0] >= 4 )) \
        || die "Bash 4+ required. On macOS run: brew install bash"
    command -v jq &>/dev/null \
        || die "jq is required. Install: sudo apt install jq  |  brew install jq"
    [[ -f "$SLIDES_JSON" ]] \
        || die "slides.json not found at $SLIDES_JSON"
    [[ -d "$SLIDES_DIR" ]] \
        || die "src/data/slides directory not found at $SLIDES_DIR"
}

# Write stdin to a temp file, then atomically replace the target.
write_json() {
    local file="$1"
    local tmp
    tmp=$(mktemp "$(dirname "$file")/.tmp.XXXXXX")
    cat > "$tmp"
    mv "$tmp" "$file"
}

# Copy an image to the slides directory.
# Args: <source-path>
# Sets global COPIED_FILENAME on success.
COPIED_FILENAME=""
copy_image() {
    local src="$1"
    src="${src/#\~/$HOME}"
    COPIED_FILENAME=""

    [[ -f "$src" ]] || { echo -e "${RED}File not found: $src${NC}"; return 1; }

    local filename
    filename=$(basename "$src")
    local dest="$SLIDES_DIR/$filename"

    if [[ -f "$dest" ]]; then
        echo -e "${YELLOW}$filename already exists in src/data/slides/.${NC}"
        read -rp "Overwrite? (y/N): " ow
        [[ "${ow,,}" == "y" ]] || { echo "Skipped copy."; return 1; }
    fi

    cp "$src" "$dest"
    COPIED_FILENAME="$filename"
    echo -e "${GREEN}Copied → src/data/slides/$filename${NC}"
}

list_slides() {
    local count
    count=$(jq 'length' "$SLIDES_JSON")

    if [[ "$count" -eq 0 ]]; then
        echo -e "${YELLOW}No slides configured.${NC}"
        return
    fi

    echo -e "${BOLD}Slides ($count):${NC}"
    jq -r 'to_entries[] | "  [\(.key)] \(.value.alt)\n       \(.value.src)"' "$SLIDES_JSON"
}

add_slide() {
    echo -e "${BOLD}--- Add Slide ---${NC}"
    echo

    local src_path
    while true; do
        read -rp "Path to image file: " src_path
        copy_image "$src_path" && break || true
    done

    local web_path="/data/slides/$COPIED_FILENAME"

    local alt
    read -rp "Alt text (brief description for accessibility): " alt

    echo "Caption (shown below the slide):"
    read -r caption

    jq --arg src "$web_path" \
       --arg alt "$alt" \
       --arg caption "$caption" \
       '. += [{"src": $src, "alt": $alt, "caption": $caption}]' \
       "$SLIDES_JSON" | write_json "$SLIDES_JSON"

    echo -e "${GREEN}Slide added.${NC}"
}

remove_slide() {
    echo -e "${BOLD}--- Remove Slide ---${NC}"
    echo
    list_slides

    local count
    count=$(jq 'length' "$SLIDES_JSON")
    [[ "$count" -eq 0 ]] && return

    echo
    read -rp "Index to remove (or q to cancel): " index
    [[ "$index" == "q" ]] && return

    if ! [[ "$index" =~ ^[0-9]+$ ]] || [[ "$index" -ge "$count" ]]; then
        echo -e "${RED}Invalid index.${NC}"; return
    fi

    local alt
    alt=$(jq -r ".[$index].alt" "$SLIDES_JSON")
    read -rp "Remove \"$alt\"? (y/N): " confirm
    [[ "${confirm,,}" == "y" ]] || { echo "Cancelled."; return; }

    jq "del(.[$index])" "$SLIDES_JSON" | write_json "$SLIDES_JSON"
    echo -e "${GREEN}Slide removed.${NC}"
}

update_slide() {
    echo -e "${BOLD}--- Update Slide ---${NC}"
    echo
    list_slides

    local count
    count=$(jq 'length' "$SLIDES_JSON")
    [[ "$count" -eq 0 ]] && return

    echo
    read -rp "Index to update (or q to cancel): " index
    [[ "$index" == "q" ]] && return

    if ! [[ "$index" =~ ^[0-9]+$ ]] || [[ "$index" -ge "$count" ]]; then
        echo -e "${RED}Invalid index.${NC}"; return
    fi

    echo
    echo "  1) Image file"
    echo "  2) Alt text"
    echo "  3) Caption"
    read -rp "What to update: " field

    case "$field" in
        1)
            local src_path
            read -rp "Path to new image: " src_path
            copy_image "$src_path" || return
            local web_path="/data/slides/$COPIED_FILENAME"
            jq --argjson i "$index" --arg v "$web_path" \
               '.[$i].src = $v' "$SLIDES_JSON" | write_json "$SLIDES_JSON"
            echo -e "${GREEN}Image updated.${NC}"
            ;;
        2)
            local current
            current=$(jq -r ".[$index].alt" "$SLIDES_JSON")
            echo "Current: $current"
            read -rp "New alt text: " new_val
            jq --argjson i "$index" --arg v "$new_val" \
               '.[$i].alt = $v' "$SLIDES_JSON" | write_json "$SLIDES_JSON"
            echo -e "${GREEN}Alt text updated.${NC}"
            ;;
        3)
            local current
            current=$(jq -r ".[$index].caption" "$SLIDES_JSON")
            echo "Current: $current"
            echo "New caption:"
            read -r new_val
            jq --argjson i "$index" --arg v "$new_val" \
               '.[$i].caption = $v' "$SLIDES_JSON" | write_json "$SLIDES_JSON"
            echo -e "${GREEN}Caption updated.${NC}"
            ;;
        *)
            echo -e "${RED}Invalid choice.${NC}"
            ;;
    esac
}

main() {
    check_deps
    echo
    echo -e "${BOLD}${CYAN}=== ELIXIR Norway — Slides Manager ===${NC}"
    echo

    while true; do
        list_slides
        echo
        echo "  a) Add slide"
        echo "  r) Remove slide"
        echo "  u) Update slide"
        echo "  q) Quit"
        echo
        read -rp "Action: " action
        echo

        case "$action" in
            a) add_slide ;;
            r) remove_slide ;;
            u) update_slide ;;
            q) echo "Bye."; exit 0 ;;
            *) echo -e "${RED}Unknown action. Choose a, r, u, or q.${NC}" ;;
        esac
        echo
    done
}

main
