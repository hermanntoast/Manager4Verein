angular.module('m4v.finances').controller('M4v_financesBookingsIndexController', function($scope, $uibModal, $http, messagebox, pageTitle, gettext, notify) {
    pageTitle.set(gettext('Buchungen'));

    $scope.my_title = gettext('Buchungen');

    $scope.months = {
        "0": {
            "id": 0,
            "name": "Alle"
        },
        "1": {
            "id": 1,
            "name": "Jan"
        },
        "2": {
            "id": 2,
            "name": "Feb"
        },
        "3": {
            "id": 3,
            "name": "Mär"
        },
        "4": {
            "id": 4,
            "name": "Apr"
        },
        "5": {
            "id": 5,
            "name": "Mai"
        },
        "6": {
            "id": 6,
            "name": "Jun"
        },
        "7": {
            "id": 7,
            "name": "Jul"
        },
        "8": {
            "id": 8,
            "name": "Aug"
        },
        "9": {
            "id": 9,
            "name": "Sep"
        },
        "10": {
            "id": 10,
            "name": "Okt"
        },
        "11": {
            "id": 11,
            "name": "Nov"
        },
        "12": {
            "id": 12,
            "name": "Dez"
        },
    }
    
    $scope.loadAccounts = () => {
        $http.get('/api/m4v/finances/accounts').then( (resp) => {
            $scope.accounts = resp.data;
            $scope.loadBookings($scope.accounts[0].id, 0);
        });
    }

    $scope.loadYears = () => {
        $http.get('/api/m4v/finances/bookings/years').then( (resp) => {
            $scope.years = resp.data;
        });
    }

    $scope.loadBookings = (account, month, year=$scope.current_year) => {
        $scope.current_account = account;
        $scope.current_month = month;
        $scope.current_year = year;
        console.log("-> Loading booking entries for account '" + $scope.current_account + "', year '" + $scope.current_year + "', month '" + $scope.current_month + "'");
        $http.post('/api/m4v/finances/bookings', {account: account, month: month, year: $scope.current_year}).then( (resp) => {
            $scope.bookings = resp.data;
            $scope.bookings_totalamount = 0;
            $scope.bookings.forEach((booking) => {
                $scope.bookings_totalamount += Number(booking.amount);
            });
            $scope.bookings_totalamount_formatted = $scope.bookings_totalamount.toFixed(2);
        });
    }

    $scope.loadProjects = () => {
        $http.get('/api/m4v/finances/projects').then( (resp) => {
            $scope.projects = resp.data;
        });
    }

    $scope.addBooking = (account) => {
        $uibModal.open({
            templateUrl : '/m4v_finances:resources/partial/addBooking.modal.html',
            controller  : 'M4VAddBookingModalController',
            backdrop: 'static',
            size: 'lg',
            resolve: { account: function() { return account; }, booking: function() { return false; } }
        }).result.then(function(booking) {
            $http.post('/api/m4v/finances/bookings/add', {
                name: booking.name, 
                description: booking.description, 
                amount: booking.amount, 
                account: booking.account, 
                project: booking.project, 
                tax_zone: booking.tax_zone, 
                invoice_image: booking.invoice_image, 
                created_by: $scope.identity.user
            }).then( (resp) => {
                notify.success(gettext('Saved successfully!'));
                $scope.loadBookings(account, $scope.current_month);
            }, error => {
                notify.error(gettext('Failed to save!'));
            });
        });
    }

    $scope.updateBooking = (account, booking) => {
        $uibModal.open({
            templateUrl : '/m4v_finances:resources/partial/addBooking.modal.html',
            controller  : 'M4VAddBookingModalController',
            backdrop: 'static',
            size: 'lg',
            resolve: { account: function() { return account; }, booking: function() { return booking; } }
        }).result.then(function(booking) {
            $http.post('/api/m4v/finances/bookings/update', {id: booking.id, name: booking.name, description: booking.description, amount: booking.amount, account: booking.account, project: booking.project, tax_zone: booking.tax_zone, invoice_image: booking.invoice_image, updated_by: $scope.identity.user}).then( (resp) => {
                notify.success(gettext('Saved successfully!'));
                $scope.loadBookings(account, $scope.current_month);
            }, error => {
                notify.error(gettext('Failed to save!'));
            });
        });
    }

    $scope.importBooking = (account) => {
        $uibModal.open({
            templateUrl : '/m4v_finances:resources/partial/importBooking.modal.html',
            controller  : 'M4VImportBookingModalController',
            backdrop: 'static',
            size: 'lg',
            resolve: { account: function() { return account; } }
        }).result.then(function() {
            $scope.loadBookings(account, $scope.current_month);
            notify.success(gettext('Saved successfully!'));
        });
    }

    $scope.$watch('identity.user', function() {
        if ($scope.identity.user == undefined) { return; }
        if ($scope.identity.user == null) { return; }

        $scope.profile = $scope.identity.profile;
        $scope.current_year = String(new Date().getFullYear());
        $scope.loadYears();
        $scope.loadAccounts();
    });

});

angular.module('m4v.finances').controller('M4VAddBookingModalController', function($scope, $uibModalInstance, $http, account, booking) {
    $scope.save = () => {
        console.log($scope.booking);
        $uibModalInstance.close($scope.booking);
    }

    $scope.close = () => {
        $uibModalInstance.dismiss();
    }

    $scope.loadProjects = () => {
        $http.get('/api/m4v/finances/projects').then( (resp) => {
            $scope.projects = resp.data;
        });
    }

    $scope.loadAccounts = () => {
        $http.get('/api/m4v/finances/accounts').then( (resp) => {
            $scope.accounts = resp.data;
        });
    }

    $scope.loadTaxzones = () => {
        $http.get('/api/m4v/finances/taxzones').then( (resp) => {
            $scope.tax_zones = resp.data;
        });
    }

    $scope.loadAttachments = (ids) => {
        $http.post('/api/m4v/finances/attachments/get', { ids: ids }).then( (resp) => {
            $scope.booking.attachments = resp.data;
        }, error => {
            $scope.booking.attachments = [];
        });
    }
    
    $scope.toggleAmountValue = () => {
        $scope.booking.amount = $scope.booking.amount * (-1);
    }

    $scope.uploadAttachment = (data) => {
        $scope.booking.attachments.push(data);
    }

    $scope.removeAttachment = (attachment) => {
        $scope.booking.attachments.splice($scope.booking.attachments.indexOf(attachment));
    }

    if (!booking) {
        $scope.booking = {};
        $scope.booking.name = "";
        $scope.booking.description = "";
        $scope.booking.amount = 0;
        $scope.booking.account = account;
        $scope.booking.project = "";
        $scope.booking.tax_zone = "";
        $scope.booking.attachments = [];
    }
    else {
        $scope.booking = booking;
        $scope.booking.amount = Number($scope.booking.amount);
        $scope.loadAttachments($scope.booking.attachments);
    }

    $scope.loadProjects();
    $scope.loadAccounts();
    $scope.loadTaxzones();
});

angular.module('m4v.finances').controller('M4VImportBookingModalController', function($scope, $uibModalInstance, $http, account) {
    $scope.tab_active = 1;
    $scope.all_selected = false;
    $scope.account = account;
    
    $scope.loadAccounts = () => {
        $http.get('/api/m4v/finances/accounts').then( (resp) => {
            $scope.accounts = resp.data;
        });
    }

    $scope.loadProjects = () => {
        $http.get('/api/m4v/finances/projects').then( (resp) => {
            $scope.projects = resp.data;
        });
    }

    $scope.loadTaxzones = () => {
        $http.get('/api/m4v/finances/taxzones').then( (resp) => {
            $scope.tax_zones = resp.data;
        });
    }

    $scope.tabs = {
        "upload": {
            "title": "Upload CSV",
            "disabled": false,
            "id": 1
        },
        "select": {
            "title": "Select Entries",
            "disabled": true,
            "id": 2
        },
        "import": {
            "title": "Import Entries",
            "disabled": true,
            "id": 3
        }
    };

    $scope.saveEntries = (data) => {
        $scope.csvdata = data;
        $scope.error = false;
    }

    $scope.loadSelectTab = () => {
        if ($scope.csvdata != undefined) {
            $scope.tabs.select.disabled = false;
            $scope.tabs.import.disabled = false;
            $scope.tab_active = 2;
        }
        else {
            $scope.error = true;
        }
        angular.forEach($scope.csvdata, function(value, key) {
            $http.post('/api/m4v/finances/bookings/exist', {booking_text: value.buchungstext, booking_usage: value.verwendungszweck, booking_account_number: value.kontonummeriban, amount: value.betrag}).then( (resp) => {
                console.log(resp.data);
                value.exist = resp.data;
                if (value.exist) {
                    value.selected = false;
                    value.disabled = true;
                }
                else {
                    value.selected = true;
                }
            });
        });
    }

    $scope.loadImportTab = () => {
        $scope.tabs.import.disabled = false;
        $scope.selectedData = [];
        angular.forEach($scope.csvdata, function(value, key) {
            console.log(value);
            if (value.selected) {
                value.project = "0";
                value.tax_zone = "0";
                $scope.selectedData.push(value);
            }
        });
        console.log($scope.selectedData);
        $scope.loadAccounts();
        $scope.loadProjects();
        $scope.loadTaxzones();
        $scope.tab_active = 3;
    }
    
    $scope.next = () => {
        if ($scope.tab_active == 1) {
            $scope.loadSelectTab();
        }
        else if ($scope.tab_active == 2) {
            $scope.loadImportTab();
        }
    }

    $scope.toggleSelection = () => {
        if ($scope.all_selected) {
            $scope.all_selected = false;
        }
        else {
            $scope.all_selected = true;
        }
        angular.forEach($scope.csvdata, function(value, key) {
            value.selected = $scope.all_selected;
        });
    }

    $scope.back = () => {
        $scope.tab_active = $scope.tab_active - 1;
    }

    $scope.import = () => {
        $scope.startImport = true;
        $scope.errorcount = 0;
        $scope.importcounter = 0;
        $scope.bookingscounter = $scope.selectedData.length;
        angular.forEach($scope.selectedData, function(value, key) {
            console.log(value);
            $http.post('/api/m4v/finances/bookings/add', {
                booking_date: value.buchungstag, 
                name: value.beguenstigterzahlungspflichtiger || "n/a", 
                description: value.verwendungszweck || "n/a", 
                amount: value.betrag, 
                account: $scope.account, 
                project: value.project, 
                tax_zone: value.tax_zone, 
                invoice_image: "",
                booking_text: value.buchungstext || "n/a", 
                booking_usage: value.verwendungszweck || "n/a",
                booking_beneficiary_payer: value.beguenstigterzahlungspflichtiger || "n/a",
                booking_account_number: value.kontonummeriban || "n/a",
                booking_bic: value.bic_swift_code || "n/a",
                created_by: $scope.identity.user
            }).then( (resp) => {
                if (!resp.data) {
                    $scope.errorcount = $scope.errorcount + 1;
                }
                $scope.importcounter = $scope.importcounter + 1;
            }, error => {
                $scope.importcounter = $scope.importcounter + 1;
                $scope.errorcount = $scope.errorcount + 1;
            });
        });
        $scope.importfinished = true;
    }

    $scope.close = () => {
        $uibModalInstance.dismiss();
    }

    $scope.finish = () => {
        $uibModalInstance.close();
    }
});
