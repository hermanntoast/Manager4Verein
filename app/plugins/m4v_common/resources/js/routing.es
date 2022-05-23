angular.module('m4v.common').config(($routeProvider) => {
    $routeProvider.when('/view/m4v/common', {
        templateUrl: '/m4v_common:resources/partial/index.html',
        controller: 'm4v_commonIndexController',
    });
});
