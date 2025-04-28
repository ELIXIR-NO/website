let elementId = 'tess-widget-events-list';
let placeholderId = 'tess-widget-events-list-placeholder';

function initTeSSWidgets() {
    TessWidget.Events(document.getElementById(elementId),
        'SimpleList',
        {
            params: {
                pageSize: 5,
                country: ['Norway']
            }
        });
    setTimeout(() => {
        const eventListContainer = document.getElementById(elementId);
        const bannerElement = document.getElementById(placeholderId);
        if (!eventListContainer || !bannerElement) return;
        // Check if the container is empty or contains only an empty <ul>
        const hasContent = Array.from(eventListContainer.children).some(child =>
            child.tagName !== 'UL' || (child.tagName === 'UL' && child.children.length > 0)
        );
        if (!hasContent) {
            eventListContainer.style.display = 'none';
            bannerElement.style.display = 'flex';
        } else {
            eventListContainer.style.display = 'flex';
            bannerElement.style.display = 'none';
        }
    }, 1500); // Delay to allow widget content to load
}
