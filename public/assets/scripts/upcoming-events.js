function initTeSSWidgets() {
    TessWidget.Events(document.getElementById('tess-widget-events-list'),
        'SimpleList',
        {
            params: {
                pageSize: 5,
                country: ['Norway']
            }
        });
}
