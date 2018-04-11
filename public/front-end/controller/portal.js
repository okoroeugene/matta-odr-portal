myApp.controller('portalController', ['$scope', '$state', '$stateParams', '$http', '$timeout', '$location', '$anchorScroll', '$window', function ($scope, $state, $stateParams, $http, $timeout, $location, $anchorScroll, $window) {
    // var url = $location.$$absUrl
    // console.log(url);
    // $scope.start = function () {
    //     cfpLoadingBar.start();
    // };
    // $scope.complete = function () {
    //     cfpLoadingBar.complete();
    // };
    // $scope.start();

    $scope.divHide = true;
    // $scope.$on('$viewContentLoaded', function () {
    //     $scope.divHide = false;
    //     $scope.divShow = true;
    // });

    $scope.PaymentStatusInit = function () {
        $scope.verifyPayment = async function () {
            await $http.get('/verifypayment').then(function (response) {
                $scope.divLoader = false;
                $scope.divContent = true;
                $scope.user = response.data.user;
                if (response.data.status == 0) {
                    // $scope.userData = true;
                    // $scope.NotAssignedPayment = true;
                    $('#divApproval').removeClass('parentDisable');
                }
                else if (response.data.status == 1) {
                    // $scope.userData = true;
                    $scope.result = response.data.result;
                    $scope.mediatorname = response.data.mediator;
                    $scope.caseId = response.data.caseId;
                    $('#divProceed').removeClass('parentDisable');
                    $scope.Paid = true;
                }
                else if (response.data.status == 2) {
                    $scope.userData = true;
                    $scope.result = response.data.result;
                    $scope.AssignedPayment = true;
                    $('#divPayment').removeClass('parentDisable');
                }
                else if (response.data.status == 3) {
                    $scope.InviteeData = true;
                    $scope.invData = response.data.invData;
                    $scope.complaintData = response.data.complaintData;
                }
                else if (response.data.status == 4) {
                    $('#divNewComplaint').removeClass('parentDisable');
                    $scope.NewComplaint = true;
                }
            });
        }
        $scope.verifyPayment();
    }

    $scope.btnChangePassword = function () {
        $('#btnChangePassword').prop('disabled', true);
        $('#btnChangePassword').addClass('active');
        var a = {
            'oldpassword': $scope.oldpassword,
            'newpassword': $scope.newpassword
        }
        $http.post('/changepassword', a).then(function (response) {
            if (response.data == 1) {
                toastr.success('Password Changed Successfully!');
                setTimeout(() => {
                    $window.location.href = '/dashboard';
                }, 1000);
            }
            if (response.data === 0) toastr["error"]("Error, Wrong Password");
            $('#btnChangePassword').prop('disabled', false);
            $('#btnChangePassword').removeClass('active');
        });
    }

    $scope.getFileDetails = async function () {
        await $http.get('/filedetails').then(function (response) {
            // $scope.userfullname = response.data.firstname + ' ' + response.data.lastname;
            // $scope.email = response.data.email;
            // $scope.phone = response.data.phone;
            $('#userfullname').val(response.data.firstname + ' ' + response.data.lastname);
            $('#useremail').val(response.data.email);
            $('#userphone').val(response.data.phone);
        });
    }
    $scope.getFileDetails();

    $scope.getRole = async function () {
        await $http.get('/userrole').then(function (response) {
            $scope.role = response.data;
        });
    }
    $scope.getRole();

    $scope.btnGotoCase = function (res) {
        window.location.href = '/case/' + res;
    }

    $scope.btnEnableDecline = () => {
        $('#btnDecline').prop('disabled', false);
        $('#btnDecline').removeClass('active');
    }

    $scope.DeclineCase = function (e) {
        $('#btnDecline').prop('disabled', true);
        $('#btnDecline').addClass('active');
        setTimeout(() => {
            $('#divLoading').css('display', 'none');
            $('#modalConfirmDiscard').modal('show');
            $('#modalConfirmDiscard').modal('toggle');
        }, 2000);
        $scope.casePaymentId = e;
    }

    $scope.btnDeclineCase = function (e) {
        $('#btnDecline').prop('disabled', true);
        $http.post('/declinecase/' + e).then(function (response) {
            if (response.data == 1) {
                toastr.success('Case Declined Successfully! You will be Assigned to another Mediator shortly');
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
                $('#modalConfirmDiscard').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
            }
            else {
                toastr["error"]("Error," + " " + "Something went wrong!!!");
            }
        });
    }

    $scope.btnMakePayment = () => {
        $('#divDashboard').fadeOut();
        setTimeout(() => {
            $('#divAssignedPayment').fadeIn().delay(1000);
        }, 500);
    }

    $scope.btnProceed = () => {
        $('#divDashboard').fadeOut();
        setTimeout(() => {
            $('#divPaid').fadeIn();
        }, 500);
    }
    // $scope.CheckStatus = function () {
    //     $http.post('/pendingcomplaint').then(function (response) {
    //         if (response.data == 1) {
    //             window.location.href = '/error';
    //         }
    //         if (response.data == 0) {
    //             window.location.href = '/new-complaint';
    //         }
    //     })
    // }



    // $scope.complete();
}]);