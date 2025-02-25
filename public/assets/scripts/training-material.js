function initTrainingMaterials() {
    TessWidget.Materials(document.getElementById('training-materials-list'),
        'SimpleList',
        {
            opts: {
                enableSearch: true
            },
            params: {
                pageSize: 10,
                q: ['Norway']
            }
        });
}
