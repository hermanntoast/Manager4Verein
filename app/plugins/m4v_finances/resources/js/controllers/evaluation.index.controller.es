angular.module('m4v.finances').controller('M4v_financesEvaluationIndexController', function($scope, $uibModal, $http, messagebox, pageTitle, gettext, notify) {
    pageTitle.set(gettext('Auswertungen'));

    $scope.my_title = gettext('Auswertungen');

    $scope.selected_project = "";
    $scope.selected_date_from = "1970-01-01";
    $scope.selected_date_to = "2100-12-31";

    $scope.loadProjects = () => {
        $http.get('/api/m4v/finances/projects').then( (resp) => {
            $scope.projects = resp.data;
        });
    }

    $scope.loadEvaluation = (project, date_from, date_to) => {
        $http.post('/api/m4v/finances/evaluations/project', { project: project, date_from: date_from, date_to: date_to }).then( (resp) => {
            console.log(resp.data);
            $scope.project_evaluation = resp.data;
            $scope.project_evaluation.total_amount_formatted = Number($scope.project_evaluation.total_amount).toFixed(2);
            $scope.project_evaluation.total_amount_plus_formatted = Number($scope.project_evaluation.total_amount_plus).toFixed(2);
            $scope.project_evaluation.total_amount_minus_formatted = Number($scope.project_evaluation.total_amount_minus).toFixed(2);
            $scope.project_evaluation.total_amount = Number($scope.project_evaluation.total_amount);
            $scope.project_evaluation.total_amount_plus = Number($scope.project_evaluation.total_amount_plus);
            $scope.project_evaluation.total_amount_minus = Number($scope.project_evaluation.total_amount_minus);
            $scope.project_evaluation.data.forEach((booking) => {
                booking.amount_formatted = Number(booking.amount).toFixed(2);
                booking.amount = Number(booking.amount);
            });
        });
    }

    $scope.$watch('identity.user', function() {
        if ($scope.identity.user == undefined) { return; }
        if ($scope.identity.user == null) { return; }

        $scope.profile = $scope.identity.profile;
        $scope.loadProjects();
    });

});