'use strict';

window.unitDb = (function () {
    const init = function (appName, payload) {
        const app = angular.module(appName, ['ngRoute', 'ngSanitize']);

        // routing
        app.config([
            '$routeProvider',
            function ($routeProvider) {
                $routeProvider
                    .when('/', {
                        controller: 'homeCtrl',
                        templateUrl: 'views/home.html',
                    })
                    .when('/by-class', {
                        controller: 'gdiCtrl',
                        templateUrl: 'views/by-class.html',
                    })
                    .when('/:ids', {
                        controller: 'compareCtrl',
                        templateUrl: 'views/compare.html',
                    })
                    .otherwise({
                        templateUrl: '404.html',
                    });
            },
        ]);

        app.run([
            '$rootScope',
            '$location',
            function ($rootScope, $location) {
                // var lastView = localStorage.getItem('lastView');
                // $location.path(lastView);

                $rootScope.$on('$routeChangeStart', function () {
                    var listViewPath = ['/', '/by-class'].indexOf($location.path()) > -1 ? $location.path() : null;

                    if (!!listViewPath) localStorage.setItem('lastView', $location.path());
                });
            },
        ]);

        // services
        app.provider('data', unitDb.services.dataProvider);
        app.config([
            'dataProvider',
            function (dataProvider) {
                if (!payload) {
                    throw new Error('No data payload provided to the dataProvider');
                }
                dataProvider.setIndex(payload);
            },
        ]);

        // filters
        angular.forEach(unitDb.filters, function (v, k) {
            app.filter(k, v);
        });

        // directives
        angular.forEach(unitDb.directives, function (v, k) {
            app.directive(k, v);
        });

        // controllers
        angular.forEach(unitDb.controllers, function (v, k) {
            app.controller(k, v);
        });

        // hash-bang introduced in AngularJS 1.6 already deprecated
        // https://webmasters.googleblog.com/2015/10/deprecating-our-ajax-crawling-scheme.html
        app.config([
            '$locationProvider',
            function ($locationProvider) {
                $locationProvider.hashPrefix('');
            },
        ]);

        return app;
    };

    const start = (appName, payload) => {
        const module = init(appName, payload);
        angular.bootstrap(document, [appName]);
        return module;
    };

    return { start };
})();
