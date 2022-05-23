angular.module('m4v.users').config(($routeProvider) => {
    $routeProvider.when('/view/m4v/users', {
        templateUrl: '/m4v_users:resources/partial/index.html',
        controller: 'M4VUsersIndexController',
    });
});
