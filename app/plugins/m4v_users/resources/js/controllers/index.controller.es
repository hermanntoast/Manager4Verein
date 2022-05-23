angular.module('m4v.users').controller('M4VUsersIndexController', function($scope, $uibModal, $http, messagebox, pageTitle, gettext, notify) {
    pageTitle.set(gettext('Users'));

    $scope.my_title = gettext('Users');
    
    $scope.loadUser = () => {
        $http.get('/api/m4v/users').then( (resp) => {
            $scope.userlist = resp.data;
        });
    }

    $scope.updateUser = (user) => {
        $uibModal.open({
            templateUrl : '/m4v_users:resources/partial/updateUser.modal.html',
            controller  : 'M4VUpdateUsersModalController',
            resolve: { user: function() { return user; } }
        }).result.then(function(user, updatepw) {
            if(updatepw) {
                $http.post('/api/m4v/users/update', {id: user.id, username: user.username, firstname: user.firstname, lastname: user.lastname, mail: user.mail, password: user.password}).then( (resp) => {
                    notify.success(gettext('Saved successfully!'));
                    $scope.loadUser();
                }, error => {
                    notify.error(gettext('Failed to save!'));
                });
            }
            else {
                $http.post('/api/m4v/users/update', {id: user.id, username: user.username, firstname: user.firstname, lastname: user.lastname, mail: user.mail}).then( (resp) => {
                    notify.success(gettext('Saved successfully!'));
                }, error => {
                    notify.error(gettext('Failed to save!'));
                });
            }
            
        });
    }

    $scope.addUser = (user) => {
        $uibModal.open({
            templateUrl : '/m4v_users:resources/partial/addUser.modal.html',
            controller  : 'M4VAddUsersModalController'
        }).result.then(function(user) {
            $http.post('/api/m4v/users/add', {username: user.username, firstname: user.firstname, lastname: user.lastname, mail: user.mail, password: user.password}).then( (resp) => {
                notify.success(gettext('Saved successfully!'));
                $scope.loadUser();
            }, error => {
                notify.error(gettext('Failed to save!'));
            });
        });
    }

    $scope.deleteUser = (user) => {
        messagebox.show({
            text: gettext("Are you sure you want to delete '" + user.username + "'?"),
            positive: gettext('Delete'),
            negative: gettext('Cancel')
        }).then(() => {
            $http.post('/api/m4v/users/delete', {id: user.id}).then( (resp) => {
                notify.success(gettext('Deleted successfully!'));
                $scope.loadUser();
            }, error => {
                notify.error(gettext('Failed to delete!'));
            });
        });
    }

    $scope.loadUser();

});

angular.module('m4v.users').controller('M4VUpdateUsersModalController', function($scope, $uibModalInstance, user) {
    $scope.user = user;
    $scope.user.password = "";
    $scope.updatepw = false;

    $scope.save = () => {
        $uibModalInstance.close($scope.user, $scope.updatepw);
    }

    $scope.close = () => {
        $uibModalInstance.dismiss();
    }
});

angular.module('m4v.users').controller('M4VAddUsersModalController', function($scope, $uibModalInstance) {
    $scope.user = {};
    $scope.user.username = "";
    $scope.user.firstname = "";
    $scope.user.lastname = "";
    $scope.user.mail = "";
    $scope.user.password = "";

    $scope.save = () => {
        $uibModalInstance.close($scope.user);
    }

    $scope.close = () => {
        $uibModalInstance.dismiss();
    }
});