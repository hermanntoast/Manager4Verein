angular.module('m4v.finances').controller('M4v_financesBookingsIndexController', function($scope, $uibModal, $http, messagebox, pageTitle, gettext, notify) {
    pageTitle.set(gettext('Buchungen'));

    $scope.my_title = gettext('Buchungen');

    $scope.months = {
        "0": {
            "id": 0,
            "name": "Alle",
            "name_long": "Alle"
        },
        "1": {
            "id": 1,
            "name": "Jan",
            "name_long": "Januar"
        },
        "2": {
            "id": 2,
            "name": "Feb",
            "name_long": "Februar"
        },
        "3": {
            "id": 3,
            "name": "Mär",
            "name_long": "März"
        },
        "4": {
            "id": 4,
            "name": "Apr",
            "name_long": "April"
        },
        "5": {
            "id": 5,
            "name": "Mai",
            "name_long": "Mai"
        },
        "6": {
            "id": 6,
            "name": "Jun",
            "name_long": "Juni"
        },
        "7": {
            "id": 7,
            "name": "Jul",
            "name_long": "Juli"
        },
        "8": {
            "id": 8,
            "name": "Aug",
            "name_long": "August"
        },
        "9": {
            "id": 9,
            "name": "Sep",
            "name_long": "September"
        },
        "10": {
            "id": 10,
            "name": "Okt",
            "name_long": "Oktober"
        },
        "11": {
            "id": 11,
            "name": "Nov",
            "name_long": "November"
        },
        "12": {
            "id": 12,
            "name": "Dez",
            "name_long": "Dezember"
        },
    }
    
    $scope.loadAccounts = () => {
        $http.get('/api/m4v/finances/accounts').then( (resp) => {
            $scope.accounts = resp.data;
            if($scope.accounts.length > 0) {
                $scope.loadBookings($scope.accounts[0].id);
            }
        });
    }

    $scope.loadYears = () => {
        $http.get('/api/m4v/finances/bookings/years').then( (resp) => {
            $scope.years = resp.data;
        });
    }

    $scope.loadBookings = (account, month=$scope.current_month, year=$scope.current_year) => {
        $scope.bookings = null;
        $scope.current_account = account;
        $scope.current_month = String(month);
        $scope.current_year = String(year);
        console.log("-> Loading booking entries for account '" + $scope.current_account + "', year '" + $scope.current_year + "', month '" + $scope.current_month + "' (" + typeof($scope.current_month) + ")");
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
            console.log(booking);
            $http.post('/api/m4v/finances/bookings/add', {
                booking_date: booking.booking_date,
                name: booking.name, 
                description: booking.description, 
                amount: booking.amount, 
                account: booking.account, 
                project: booking.project, 
                tax_zone: booking.tax_zone, 
                invoice_image: booking.invoice_image, 
                created_by: $scope.identity.user
            }).then( (resp) => {
                console.log(resp.data);
                notify.success(gettext('Saved successfully!'));
                $scope.loadYears();
                $scope.loadBookings(account, $scope.current_month);
            }, error => {
                notify.error(gettext('Failed to save!'));
            });
        });
    }

    $scope.updateBooking = (booking) => {
        $http.post('/api/m4v/finances/bookings/update', {
            id: booking.id, 
            booking_date: booking.booking_date, 
            name: booking.name, 
            description: booking.description, 
            amount: booking.amount, 
            account: booking.account, 
            project: booking.project, 
            tax_zone: booking.tax_zone, 
            invoice_image: booking.invoice_image, 
            updated_by: $scope.identity.user
        }).then( (resp) => {
            notify.success(gettext('Saved successfully!'));
            $scope.loadBookings($scope.current_account, $scope.current_month);
        }, error => {
            notify.error(gettext('Failed to save!'));
        });
    }

    $scope.deleteBooking = (booking) => {
        messagebox.show({
            text: gettext("Are you sure you want to delete this entry?") + " " + booking.name + " / " + booking.description + "?",
            positive: gettext('Delete'),
            negative: gettext('Cancel')
        }).then(() => {
            $http.post('/api/m4v/finances/bookings/delete', { id: booking.id }).then( (resp) => {
                notify.success(gettext('Deleted successfully!'));
            });
            $scope.loadBookings($scope.current_account, $scope.current_month);
        });
    }

    // $scope.updateBookingModal = (account, booking) => {
    //     $uibModal.open({
    //         templateUrl : '/m4v_finances:resources/partial/addBooking.modal.html',
    //         controller  : 'M4VAddBookingModalController',
    //         backdrop: 'static',
    //         size: 'lg',
    //         resolve: { account: function() { return account; }, booking: function() { return booking; } }
    //     }).result.then(function(booking) {
    //         if(booking.action == "update") {
    //             $http.post('/api/m4v/finances/bookings/update', {
    //                 id: booking.id, 
    //                 booking_date: booking.booking_date, 
    //                 name: booking.name, 
    //                 description: booking.description, 
    //                 amount: booking.amount, 
    //                 account: booking.account, 
    //                 project: booking.project, 
    //                 tax_zone: booking.tax_zone, 
    //                 invoice_image: booking.invoice_image, 
    //                 updated_by: $scope.identity.user
    //             }).then( (resp) => {
    //                 notify.success(gettext('Saved successfully!'));
    //                 $scope.loadBookings(account, $scope.current_month);
    //             }, error => {
    //                 notify.error(gettext('Failed to save!'));
    //             });
    //         }
    //         else if(booking.action == "delete") {
    //             messagebox.show({
    //                 text: gettext("Are you sure you want to delete '" + booking.name + "'?"),
    //                 positive: gettext('Delete'),
    //                 negative: gettext('Cancel')
    //             }).then(() => {
    //                 $http.post('/api/m4v/finances/bookings/delete', { id: booking.id }).then( (resp) => {
    //                     notify.success(gettext('Deleted successfully!'));
    //                 });
    //                 $scope.loadBookings(account, $scope.current_month);
    //             });
    //         }
            
    //     });
    // }

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

    // $scope.filter = (row) => {
    //     let result = false;
    //     console.log(row);
    //     for (var value of ['name', 'description']) {
    //         if (row[value] != undefined) {
    //             result = result || row[value].toLowerCase().indexOf($scope.query.toLowerCase() || '') != -1;
    //         }
    //     }
    //     return result;
    // }

    $scope.toggleAmountValue = (booking) => {
        booking.amount = booking.amount * (-1);
    }

    $scope.closeAllOpenBookings = () => {
        for (const booking in $scope.bookings) {
            $scope.bookings[booking].edit = false;
        }
    }

    $scope.$watch('identity.user', function() {
        if ($scope.identity.user == undefined) { return; }
        if ($scope.identity.user == null) { return; }

        $scope.profile = $scope.identity.profile;
        $scope.current_year = String(new Date().getFullYear());
        $scope.current_month = String(new Date().getMonth() + 1);
        console.log($scope.current_month);
        $scope.query = "";
        $scope.loadYears();
        $scope.loadAccounts();
        $scope.loadProjects();
    });

});

angular.module('m4v.finances').controller('M4VAddBookingModalController', function($scope, $uibModalInstance, $http, account, booking) {
    $scope.save = () => {
        $scope.booking.action = "update";
        $uibModalInstance.close($scope.booking);
    }

    $scope.close = () => {
        $uibModalInstance.dismiss();
    }

    $scope.delete = () => {
        $scope.booking.action = "delete";
        $uibModalInstance.close($scope.booking);
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
        for (const file of data) {
            $scope.booking.attachments.push(file);
        }
    }

    $scope.removeAttachment = (attachment) => {
        $scope.booking.attachments.splice($scope.booking.attachments.indexOf(attachment), 1);
    }

    if (!booking) {
        let today = new Date();
        $scope.booking = {};
        $scope.booking.booking_date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        $scope.booking.name = "";
        $scope.booking.description = "";
        $scope.booking.amount = 0;
        $scope.booking.account = account;
        $scope.booking.project = 0;
        $scope.booking.tax_zone = 0;
        $scope.booking.attachments = [];
        $scope.newbooking = true;
    }
    else {
        $scope.booking = booking;
        $scope.newbooking = false;
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
        $scope.csvdata = [];
        for (let entry of data) {
            console.log(entry);
            if (!("kontonummeriban" in entry)) {
                entry.kontonummeriban = "n/a";
                entry.beguenstigterzahlungspflichtiger = "Sparkasse Schwarzwald-Baar";
            }
            if (entry.verwendungszweck == "") {
                entry.verwendungszweck = entry.buchungstext;
            }
            $scope.csvdata.push(entry);
        }
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
