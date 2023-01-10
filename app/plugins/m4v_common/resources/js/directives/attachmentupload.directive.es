angular.module('core').directive("attachmentFileUploader", function($http) {
	return {
    	restrict: "E",
        template: "" + 
        "<div class='row'><div class='form-group col-md-10'>" +
            "<input id='inputFile' class='form-control' type='file' accept='image/*, .pdf' style='height: 40px;' multiple/>" +
        "</div>" + 
        "<div class='form-group col-md-2'>" + 
            "<button class='btn' ng-click='uploadFile()' style='height: 40px;width: 100%;' translate>Load</button>" +
            "</div>" + 
        "</div>" +
        "<span ng:show='FileToBig' style='color:red;' translate>One or more file were to big to upload!</span>" +
        "<progress-spinner ng:show='loading != null'></progress-spinner>",
        scope: {
        	uploaded: "&"
        },
        link: function(scope, element) {
        	scope.uploadFile = function() {
            	scope.FileToBig = false;
                scope.loading = true;
            	var input = element.find("input");
                var result = new Array();
                var counter = input[0].files.length;
                for(const file of input[0].files) {
                    if(file.size > 20971520) {
                        scope.FileToBig = true;
                        counter -= 1;
                        if(counter <= 0) {
                            input.val(null);
                            scope.loading = null;
                            scope.uploaded({ result: result });
                        }
                        continue;
                    }
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        result.push({file: e.target.result, filename: file.name});
                        counter -= 1;
                        if(counter <= 0) {
                            input.val(null);
                            scope.loading = null;
                            scope.uploaded({ result: result });
                        }
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    }
}); 