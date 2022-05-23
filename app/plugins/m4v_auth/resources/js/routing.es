angular.module('m4v.auth').config(($routeProvider) => {
    $routeProvider.when('/view/m4v/auth', {
        templateUrl: '/m4v_auth:resources/partial/index.html',
        controller: 'm4v_authIndexController',
    });
});
