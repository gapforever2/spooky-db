'use strict';
unitDb.controllers = {
    homeCtrl: ['$scope', '$window', '$location', 'data', function ($scope, $window, $location, data) {
        $scope.factions = [];
        $scope.kinds = [];
        $scope.tech = [];

        $scope.index = data.items;
        $scope.version = data.version;
        $scope.contenders = data.contenders;
        $scope.isWeb = $window.helpers.isWeb();

        const toggleArray = function (arr, el) {
            var idx = arr.indexOf(el);
            if (idx >= 0) {
                arr = arr.splice(idx, 1);
            } else {
                arr.push(el);
            }
        };
        const isInArray = function (arr, el) {
            return arr.indexOf(el) >= 0;
        };

        $scope.toggleFaction = function (f) {
            toggleArray($scope.factions, f);
        };
        $scope.factionSelected = function (f) {
            return isInArray($scope.factions, f);
        };
        $scope.toggleKind = function (k) {
            toggleArray($scope.kinds, k);
        };
        $scope.kindSelected = function (k) {
            return isInArray($scope.kinds, k);
        };
        $scope.toggleTech = function (t) {
            toggleArray($scope.tech, t);
        };
        $scope.techSelected = function (t) {
            return isInArray($scope.tech, t);
        };
        $scope.compare = function (item) {
            item.selected = !item.selected;

            var idx = $scope.contenders.indexOf(item.id);
            if (idx === -1)
                $scope.contenders.push(item.id);
            else
                $scope.contenders.splice(idx, 1);
        };
        $scope.clear = function () {
            for (var c in $scope.index)
                if ($scope.index[c].selected)
                    $scope.index[c].selected = false;

            // clear the array without loosing reference
            $scope.contenders.length = 0;
        };
        $scope.strain = function (e) {
            return ($scope.factions.length === 0 || isInArray($scope.factions, e.faction)) &&
                ($scope.kinds.length === 0 || isInArray($scope.kinds, e.classification)) &&
                ($scope.tech.length === 0 || isInArray($scope.tech, e.tech));
        };

        var lastClickTime = 0;
        var lastClickUnit = null;
        var maxDoubleClickDelay = 500; //in miliseconds

        $scope.unitClick = function (unit, event) {
            //What happens when the user click on a unit thumbnail in the home
            //view (the click actually happens in the thumb view)

            if (event.ctrlKey) {//The control key is pressed: we open a new page
                //with only the unit
                $window.open('#/' + unit.id, '_blank');

            } else {
                var newTime = (new Date()).getTime();

                if ((lastClickUnit === unit) && //it a double click: we go to
                    (newTime - lastClickTime) < maxDoubleClickDelay) { //compare view
                    if (!unit.selected)
                        $scope.compare(unit);

                    var newURL = '/' + $scope.contenders.join(',');
                    $scope.$apply($location.path(newURL));

                } else {
                    lastClickUnit = unit;
                    lastClickTime = newTime;
                    $scope.compare(unit);
                }
            }
        };
    }],

    gdiCtrl: ['$scope', '$window', '$location', 'data', function ($scope, $window, $location, data) {
        $scope.compact = false || (localStorage.getItem('compact') === 'true');

        $scope.factions = data.selectedFilterFractions;
        $scope.kinds = data.selectedFilterKinds;
        $scope.tech = data.selectedFilterTech;

        $scope.index = data.items;
        $scope.version = data.version;
        $scope.visibleIndex = data.visibleIndex;
        $scope.contenders = data.contenders;
        $scope.isWeb = $window.helpers.isWeb();

        const toggleArray = function (arr, el) {
            var idx = arr.indexOf(el);
            if (idx >= 0) {
                arr = arr.splice(idx, 1);
            } else {
                arr.push(el);
            }
        };
        const isInArray = function (arr, el) {
            return arr.indexOf(el) >= 0;
        };

        $scope.toggleFaction = function (f) {
            toggleArray($scope.factions, f);
        };
        $scope.factionSelected = function (f) {
            return isInArray($scope.factions, f);
        };
        $scope.toggleKind = function (k) {
            toggleArray($scope.kinds, k);
        };
        $scope.kindSelected = function (k) {
            return isInArray($scope.kinds, k);
        };
        $scope.toggleTech = function (t) {
            toggleArray($scope.tech, t);
        };
        $scope.techSelected = function (t) {
            return isInArray($scope.tech, t);
        };
        $scope.toggleBpSelected = function (item) {
            item.selected = !item.selected;

            var idx = $scope.contenders.indexOf(item.id);
            if (idx === -1)
                $scope.contenders.push(item.id);
            else
                $scope.contenders.splice(idx, 1);
        };
        $scope.setBpSelected = function (item, selected) {
            item.selected = selected;

            var idx = $scope.contenders.indexOf(item.id);
            if (idx === -1 && selected)
                $scope.contenders.push(item.id);
            else if (!selected)
                $scope.contenders.splice(idx, 1);
        };
        $scope.toggleBpSelectedByGdiClass = function (gdiClass) {
            console.log('gdiClass', gdiClass);
            const longId = (item) => item.factionId + item.id.substr(-4);
            const byLongId = (a, b) => lingId(a) > longId(b) ? 1 : -1;
            const inClassification = (item) => item.gdiClassification === gdiClass && $scope.strain(item);
            const classItems = $scope.index.filter(inClassification).sort(byLongId);
            var newStateIsSelected = true;
            if (classItems.length > 0) {
                newStateIsSelected = !classItems[0].selected;
            }
            for (var c in classItems)
                $scope.setBpSelected(classItems[c], newStateIsSelected);
        };
        $scope.clear = function () {
            for (var c in $scope.index)
                if ($scope.index[c].selected)
                    $scope.index[c].selected = false;

            $scope.contenders.splice($scope.contenders.len);
        };
        $scope.strain = function (e) {
            return ($scope.factions.length === 0 || isInArray($scope.factions, e.faction)) &&
                ($scope.kinds.length === 0 || isInArray($scope.kinds, e.classification)) &&
                ($scope.tech.length === 0 || isInArray($scope.tech, e.tech));
        };
        $scope.uniqGdiClass = function (e, idx) {
            if (idx === 0 || e.gdiClassification !== $scope.lastDisplayedGdiClassification) {
                $scope.lastDisplayedGdiClassification = e.gdiClassification;
                return e.gdiClassification;
            }
        };
        $scope.uniqGdiBaseClass = function (e, idx) {
            if (idx === 0 || e.gdiBaseClassification !== $scope.lastDisplayedGdiBaseClassification) {
                $scope.lastDisplayedGdiBaseClassification = e.gdiBaseClassification;
                return e.gdiBaseClassification;
            }
        };
        $scope.compare = function (item) {
            item.selected = !item.selected;

            var idx = $scope.contenders.indexOf(item.id);
            if (idx === -1)
                $scope.contenders.push(item.id);
            else
                $scope.contenders.splice(idx, 1);
        };

        var lastClickTime = 0;
        var lastClickUnit = null;
        var maxDoubleClickDelay = 500; //in miliseconds

        $scope.unitClick = function (unit, event) {
            //What happens when the user click on a unit thumbnail in the home
            //view (the click actually happens in the thumb view)

            if (event.ctrlKey) {//The control key is pressed: we open a new page
                //with only the unit
                $window.open('#/' + unit.id, '_blank');

            } else {
                var newTime = (new Date()).getTime();

                if ((lastClickUnit === unit) && //it a double click: we go to
                    (newTime - lastClickTime) < maxDoubleClickDelay) { //compare view
                    if (!unit.selected)
                        $scope.compare(unit);

                    var newURL = '/' + $scope.contenders.join(',');
                    $scope.$apply($location.path(newURL));

                } else {
                    lastClickUnit = unit;
                    lastClickTime = newTime;
                    $scope.compare(unit);
                }
            }
        };

        $scope.toggleCompact = function () {
            $scope.compact = !$scope.compact;
            localStorage.setItem('compact', $scope.compact);
        };
    }],

    compareCtrl: ['$scope', '$window', '$routeParams', '$location', '$timeout', 'data', function ($scope, $window, $routeParams, $location, $timeout, data) {
        $scope.layoutClass = localStorage.getItem('compareLayout') || 'bricks';
        $scope.timeFormatted = localStorage.getItem('timeFormatted') === 'm:ss';
        $scope.isWeb = $window.helpers.isWeb();

        const ids = $routeParams.ids.split(',').map(id => id.trim());
        const byIds = (a, b) => {
            return ids.indexOf(a.id) - ids.indexOf(b.id);
        };
        $scope.contenders = data.items.filter(item => ids.includes(item.id)).sort(byIds);

        $timeout(() => {
            $scope.brickInstance = $scope.brickInstance || $window.helpers.initBricks('div.compare-container section');
            $window.helpers.repackBricks($scope.brickInstance, $scope.layoutClass);
        }, 100);

        $scope.layout = (className) => {
            $scope.layoutClass = className;
            $window.helpers.repackBricks($scope.brickInstance, $scope.layoutClass);
            localStorage.setItem('compareLayout', className);
        };

        $scope.back = () => {
            var lastView = localStorage.getItem('lastView') || '/';
            $location.path(lastView);
        };
    }]
};
