angular.module('m4v.finances').config(($routeProvider) => {
    $routeProvider.when('/view/m4v/finances/accounts', {
        templateUrl: '/m4v_finances:resources/partial/accounts.index.html',
        controller: 'M4v_financesAccountsIndexController',
    });
    $routeProvider.when('/view/m4v/finances/bookings', {
        templateUrl: '/m4v_finances:resources/partial/bookings.index.html',
        controller: 'M4v_financesBookingsIndexController',
    });
    $routeProvider.when('/view/m4v/finances/projects', {
        templateUrl: '/m4v_finances:resources/partial/projects.index.html',
        controller: 'M4v_financesProjectsIndexController',
    });
});
