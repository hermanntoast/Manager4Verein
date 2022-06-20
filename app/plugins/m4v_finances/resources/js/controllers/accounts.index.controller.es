angular.module('m4v.finances').controller('M4v_financesAccountsIndexController', function($scope, $uibModal, $http, messagebox, pageTitle, gettext, notify) {
    pageTitle.set(gettext('Konten'));

    $scope.my_title = gettext('Konten');
    
    $scope.loadAccounts = () => {
        $http.get('/api/m4v/finances/accounts').then( (resp) => {
            $scope.accounts = resp.data;
            $scope.calculateAmounts();
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

    $scope.deleteAccount = (account) => {
        $http.post('/api/m4v/finances/bookings/count', { id: account.id }).then( (resp) => {
            var count_bookings = resp.data[0].count_bookings;
            messagebox.show({
                text: gettext("Are you sure you want to delete '" + account.name + "' and the related " + count_bookings + " bookings?"),
                positive: gettext('Delete'),
                negative: gettext('Cancel')
            }).then(() => {
                $http.post('/api/m4v/finances/bookings', {account: account.id, month: 0, year: 0}).then( (resp) => {
                    let bookings = resp.data;
                    angular.forEach($scope.accounts, function(value, key) {
                        $http.post('/api/m4v/finances/bookings/delete', { id: value.id }).then( (resp) => {
                            console.log("Deleted booking " + value.id + "...");
                        });
                    });
                    $http.post('/api/m4v/finances/accounts/delete', {id: account.id}).then( (resp) => {
                        notify.success(gettext('Deleted successfully!'));
                        $scope.loadAccounts();
                    }, error => {
                        notify.error(gettext('Failed to delete!'));
                    });
                });
            });
        });
    }

    $scope.calculateAmounts = () => {
        $scope.total = 0;
        angular.forEach($scope.accounts, function(value, key) {
            $http.post('/api/m4v/finances/accounts/calc', { id: value.id }).then( (resp) => {
                if(resp.data[0].account_total != "None") {
                    value.total_amount = Number(resp.data[0].account_total).toFixed(2);
                    $scope.total = Number(Number($scope.total) + Number(value.total_amount)).toFixed(2);
                }
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