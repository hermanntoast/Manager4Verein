angular.module('m4v.finances').controller('M4v_financesAccountsIndexController', function($scope, $uibModal, $http, messagebox, pageTitle, gettext, notify) {
    pageTitle.set(gettext('Konten'));

    $scope.my_title = gettext('Konten');
    
    $scope.loadAccounts = () => {
        $http.get('/api/m4v/finances/accounts').then( (resp) => {
            $scope.accounts = resp.data;
            console.log(resp.data);
        });
    }

    $scope.addAccount = (user) => {
        $uibModal.open({
            templateUrl : '/m4v_finances:resources/partial/addAccount.modal.html',
            controller  : 'M4VAddAccountModalController'
        }).result.then(function(account) {
            $http.post('/api/m4v/finances/accounts/add', {name: account.name, description: account.description, type: account.type, created_by: $scope.identity.user}).then( (resp) => {
                notify.success(gettext('Saved successfully!'));
                $scope.loadAccounts();
            }, error => {
                notify.error(gettext('Failed to save!'));
            });
        });
    }

    $scope.$watch('identity.user', function() {
        if ($scope.identity.user == undefined) { return; }
        if ($scope.identity.user == null) { return; }

        $scope.profile = $scope.identity.profile;
        $scope.loadAccounts();
    });

});

angular.module('m4v.finances').controller('M4VAddAccountModalController', function($scope, $uibModalInstance) {
    $scope.account = {};
    $scope.account.name = "";
    $scope.account.description = "";
    $scope.account.type = "";

    $scope.save = () => {
        $uibModalInstance.close($scope.account);
    }

    $scope.close = () => {
        $uibModalInstance.dismiss();
    }
});