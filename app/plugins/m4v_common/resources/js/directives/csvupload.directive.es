angular.module('core').directive("csvFileUploader", function($http) {
	return {
    	restrict: "E",
        template: "<div class='row'><div class='form-group col-md-10'><input id='inputFile' class='form-control' type='file' accept='.csv' style='height: 40px;'/></div><div class='form-group col-md-2'><button class='btn' ng-click='uploadFile()' style='height: 40px;width: 100%;' translate>Load Data</button></div></div>",
        scope: {
        	uploaded: "&"
        },
        link: function(scope, element) {
        	scope.uploadFile = function() {
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
                            $http.post('/api/m4v/common/files/csv', {filecontent: evt.target.result}).then( (resp) => {
                                scope.uploaded({data: resp.data});
                            });
                        }
                    }
                }
            }
        }
    }
});