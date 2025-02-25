function initPastTrainingMaterials() {
    TessWidget.Events(document.getElementById('past-training-materials-list'),
        'SimpleList',
        {
            // opts: {
            //     enableSearch: true
            // },
            params: {
                pageSize: 10,
                country: ['Norway'],
                sort: 'new',
                includeExpired: true,
                includeDisabled: false,
            }
        });
}
