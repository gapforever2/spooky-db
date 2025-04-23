'use strict';
unitDb.services = {
    dataProvider: function () {
        let units = [];
        let contenders = [];
        let version = null;
        let error = null;

        this.setIndex = function (index) {
            if (index.version) {
                units = index.units;
                version = index.version;
            } else {
                error = index.error;
            }
        };

        this.$get = [
            '$location',
            function ($location) {
                return {
                    error,
                    version,
                    items: units.map(unitDb.UnitDecorator),
                    selectedFilterFractions: [],
                    selectedFilterKinds: [],
                    selectedFilterTech: [],
                    contenders,
                };
            },
        ];
    },
};
