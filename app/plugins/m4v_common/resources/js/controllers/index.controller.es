angular.module('m4v.common').run(function(customization) {
     customization.plugins.core.title = 'Manager4Verein'
});

angular.module('m4v.common').controller('m4v_commonIndexController', function($scope, $http, pageTitle, gettext, notify) {
    pageTitle.set(gettext('m4v_common'));
});
