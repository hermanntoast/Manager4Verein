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
        template: "" + "<div class='row'><div class='form-group col-md-10'>" + "<input id='inputFile' class='form-control' type='file' accept='image/*, .pdf' style='height: 40px;' multiple/>" + "</div>" + "<div class='form-group col-md-2'>" + "<button class='btn' ng-click='uploadFile()' style='height: 40px;width: 100%;' translate>Load</button>" + "</div>" + "</div>" + "<span ng:show='FileToBig' style='color:red;' translate>One or more file were to big to upload!</span>" + "<progress-spinner ng:show='loading != null'></progress-spinner>",
        scope: {
            uploaded: "&"
        },
        link: function link(scope, element) {
            scope.uploadFile = function () {
                scope.FileToBig = false;
                scope.loading = true;
                var input = element.find("input");
                var result = new Array();
                var counter = input[0].files.length;
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    var _loop = function _loop() {
                        var file = _step.value;

                        if (file.size > 20971520) {
                            scope.FileToBig = true;
                            counter -= 1;
                            if (counter <= 0) {
                                input.val(null);
                                scope.loading = null;
                                scope.uploaded({ result: result });
                            }
                            return "continue";
                        }
                        reader = new FileReader();

                        reader.onload = function (e) {
                            result.push({ file: e.target.result, filename: file.name });
                            counter -= 1;
                            if (counter <= 0) {
                                input.val(null);
                                scope.loading = null;
                                scope.uploaded({ result: result });
                            }
                        };
                        reader.readAsDataURL(file);
                    };

                    for (var _iterator = input[0].files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var reader;

                        var _ret = _loop();

                        if (_ret === "continue") continue;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            };
        }
    };
});


'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
function getDecimals(n) {
  n = n + '';
  var i = n.indexOf('.');
  return (i == -1) ? 0 : n.length - i - 1;
}

function getVF(n, opt_precision) {
  var v = opt_precision;

  if (undefined === v) {
    v = Math.min(getDecimals(n), 3);
  }

  var base = Math.pow(10, v);
  var f = ((n * base) | 0) % base;
  return {v: v, f: f};
}

$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "vorm.",
      "nachm."
    ],
    "DAY": [
      "Sonntag",
      "Montag",
      "Dienstag",
      "Mittwoch",
      "Donnerstag",
      "Freitag",
      "Samstag"
    ],
    "ERANAMES": [
      "v. Chr.",
      "n. Chr."
    ],
    "ERAS": [
      "v. Chr.",
      "n. Chr."
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "Januar",
      "Februar",
      "M\u00e4rz",
      "April",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember"
    ],
    "SHORTDAY": [
      "So.",
      "Mo.",
      "Di.",
      "Mi.",
      "Do.",
      "Fr.",
      "Sa."
    ],
    "SHORTMONTH": [
      "Jan.",
      "Feb.",
      "M\u00e4rz",
      "Apr.",
      "Mai",
      "Juni",
      "Juli",
      "Aug.",
      "Sep.",
      "Okt.",
      "Nov.",
      "Dez."
    ],
    "STANDALONEMONTH": [
      "Januar",
      "Februar",
      "M\u00e4rz",
      "April",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, d. MMMM y",
    "longDate": "d. MMMM y",
    "medium": "dd.MM.y HH:mm:ss",
    "mediumDate": "dd.MM.y",
    "mediumTime": "HH:mm:ss",
    "short": "dd.MM.yy HH:mm",
    "shortDate": "dd.MM.yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20ac",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": ".",
    "PATTERNS": [
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 3,
        "minFrac": 0,
        "minInt": 1,
        "negPre": "-",
        "negSuf": "",
        "posPre": "",
        "posSuf": ""
      },
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "-",
        "negSuf": "\u00a0\u00a4",
        "posPre": "",
        "posSuf": "\u00a0\u00a4"
      }
    ]
  },
  "id": "de-de",
  "localeID": "de_DE",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);

