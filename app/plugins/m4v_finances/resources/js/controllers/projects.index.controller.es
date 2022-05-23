angular.module('m4v.finances').controller('M4v_financesProjectsIndexController', function($scope, $uibModal, $http, messagebox, pageTitle, gettext, notify) {
    pageTitle.set(gettext('Projekte'));

    $scope.my_title = gettext('Projekte');

    $scope.loadProjects = () => {
        $http.get('/api/m4v/finances/projects').then( (resp) => {
            $scope.projects = resp.data;
        });
    }

    $scope.addProject = () => {
        $uibModal.open({
            templateUrl : '/m4v_finances:resources/partial/addProject.modal.html',
            controller  : 'M4VAddProjectModalController',
            resolve: { project: function() { return false; } }
        }).result.then(function(project) {
            $http.post('/api/m4v/finances/projects/add', {name: project.name, description: project.description, created_by: $scope.identity.user}).then( (resp) => {
                notify.success(gettext('Saved successfully!'));
                $scope.loadProjects();
            }, error => {
                notify.error(gettext('Failed to save!'));
            });
        });
    }

    $scope.updateProject = (project) => {
        $uibModal.open({
            templateUrl : '/m4v_finances:resources/partial/addProject.modal.html',
            controller  : 'M4VAddProjectModalController',
            resolve: { project: function() { return project; } }
        }).result.then(function(project) {
            $http.post('/api/m4v/finances/projects/update', {id: project.id, name: project.name, description: project.description, updated_by: $scope.identity.user}).then( (resp) => {
                notify.success(gettext('Saved successfully!'));
                $scope.loadProjects();
            }, error => {
                notify.error(gettext('Failed to save!'));
            });
        });
    }

    $scope.deleteProject = (project) => {
        messagebox.show({
            text: gettext("Are you sure you want to delete '" + project.name + "'?"),
            positive: gettext('Delete'),
            negative: gettext('Cancel')
        }).then(() => {
            $http.post('/api/m4v/finances/projects/delete', {id: project.id}).then( (resp) => {
                notify.success(gettext('Deleted successfully!'));
                $scope.loadProjects();
            }, error => {
                notify.error(gettext('Failed to delete!'));
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

angular.module('m4v.finances').controller('M4VAddProjectModalController', function($scope, $uibModalInstance, project) {
    if (!project) {
        $scope.project = {};
        $scope.project.name = "";
        $scope.project.description = "";
    }
    else {
        $scope.project = project;
    }

    $scope.save = () => {
        $uibModalInstance.close($scope.project);
    }

    $scope.close = () => {
        $uibModalInstance.dismiss();
    }
});