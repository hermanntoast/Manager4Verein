'use strict';

// the module should depend on 'core' to use the stock services & components
angular.module('m4v.common', ['core']);


'use strict';

angular.module('m4v.common').config(function ($routeProvider) {
    $routeProvider.when('/view/m4v/common', {
        templateUrl: '/m4v_common:resources/partial/index.html',
        controller: 'm4v_commonIndexController'
    });
});


'use strict';

angular.module('m4v.common').run(function (customization) {
    customization.plugins.core.title = 'Manager4Verein';
});

angular.module('m4v.common').controller('m4v_commonIndexController', function ($scope, $http, pageTitle, gettext, notify) {
    pageTitle.set(gettext('m4v_common'));
});


"use strict";

angular.module('core').directive("csvFileUploader", function ($http) {
    return {
        restrict: "E",
        template: "<div class='row'><div class='form-group col-md-10'><input id='inputFile' class='form-control' type='file' accept='.csv' style='height: 40px;'/></div><div class='form-group col-md-2'><button class='btn' ng-click='uploadFile()' style='height: 40px;width: 100%;' translate>Load Data</button></div></div>",
        scope: {
            uploaded: "&"
        },
        link: function link(scope, element) {
            scope.uploadFile = function () {
                var input = element.find("input");
                var fileName = input.val();
                if (fileName) {
                    fileName = fileName.toLowerCase().replace("c:\\fakepath\\", "");
                    if (fileName.indexOf(".csv") !== -1) {
                        var name = fileName.split(".")[0];
                        var file = input[0].files[0];
                        var reader = new FileReader();
                        reader.readAsText(file, "ISO-8859-1");
                        reader.onload = function (evt) {
                            $http.post('/api/m4v/common/files/csv', { filecontent: evt.target.result }).then(function (resp) {
                                scope.uploaded({ data: resp.data });
                            });
                        };
                    }
                }
            };
        }
    };
});


"use strict";

angular.module('core').directive("attachmentFileUploader", function ($http) {
    return {
        restrict: "E",
        template: "<div class='row'><div class='form-group col-md-10'><input id='inputFile' class='form-control' type='file' accept='.pdf,.jpg,.jpeg,.png' style='height: 40px;'/></div><div class='form-group col-md-2'><button class='btn' ng-click='uploadFile()' style='height: 40px;width: 100%;' translate>Load Data</button></div></div>",
        scope: {
            uploaded: "&"
        },
        link: function link(scope, element) {
            scope.uploadFile = function () {
                var input = element.find("input");
                var fileName = input.val();
                if (fileName) {
                    fileName = fileName.toLowerCase().replace("c:\\fakepath\\", "");
                    var name = fileName.split(".")[0];
                    var extension = fileName.split(".")[1];
                    var file = input[0].files[0];
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function () {
                        scope.uploaded({ data: reader.result });
                    };
                }
            };
        }
    };
});


