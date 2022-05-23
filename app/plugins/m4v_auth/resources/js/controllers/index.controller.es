angular.module('m4v.auth').controller('m4v_authIndexController', function($scope, $http, pageTitle, gettext, notify) {
    pageTitle.set(gettext('m4v_auth'));
});
