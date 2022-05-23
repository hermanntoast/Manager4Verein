angular.module('example.m4v_dashboard').config(($routeProvider) => {
    $routeProvider.when('/view/dashboard', {
        templateUrl: '/m4v_dashboard:resources/partial/index.html',
        controller: 'M4v_dashboardIndexController',
    });
});
