'use strict';

// the module should depend on 'core' to use the stock services & components
angular.module('m4v.auth', ['core']);


'use strict';

angular.module('m4v.auth').config(function ($routeProvider) {
    $routeProvider.when('/view/m4v/auth', {
        templateUrl: '/m4v_auth:resources/partial/index.html',
        controller: 'm4v_authIndexController'
    });
});


'use strict';

angular.module('m4v.auth').controller('m4v_authIndexController', function ($scope, $http, pageTitle, gettext, notify) {
    pageTitle.set(gettext('m4v_auth'));
});


