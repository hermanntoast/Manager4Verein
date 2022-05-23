angular.module('example.m4v_dashboard').controller('M4v_dashboardIndexController', function($scope, $http, pageTitle, gettext, notify) {
    pageTitle.set(gettext('Dashboard'));

    $scope.counter = 0;

    $scope.click = () => {
            $scope.counter += 1;
            notify.info('+1');
        };

    // Bind a test var with the template.
    $scope.my_title = gettext('Dashboard');
    
    // GET a result through Python API
    $http.get('/api/m4v_dashboard').then( (resp) => {
	    $scope.python_get = resp.data;
    });

    // POST a result through Python API
    $http.post('/api/m4v_dashboard', {my_var: 'm4v_dashboard'}).then( (resp) => {
	    $scope.python_post = resp.data;
    });

});

