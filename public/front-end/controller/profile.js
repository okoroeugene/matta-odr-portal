myApp.controller('profileController', ['$scope', '$state', '$stateParams', 'cfpLoadingBar', '$http', '$timeout', '$location', '$anchorScroll', '$window', function ($scope, $state, $stateParams, cfpLoadingBar, $http, $timeout, $location, $anchorScroll, $window) {

    var currentId = $stateParams.id;

    $scope.allcomplaints = [];
    $scope.Complaints = async function () {
        await $http.get('/allcomplaints').then(function (response) {
            // console.log(response.data);
            if (response.data === 0) window.location = '/';
            else {
                $scope.allcomplaints = response.data;
            }
        })
    }

    $scope.Complaints();

    $scope.MediatorCase = async function () {
        await $http.get('/complaints').then(function (response) {
            // console.log(response.data);
            if (response.data === 0) window.location = '/';
            else {
                $scope.mediatorCase = response.data;
            }
        })
    }

    $scope.MediatorCase();

    $scope.getallcases = async function () {
        await $http.get('/getallcases').then(function (response) {
            $scope.allcases = response.data;
        });
    }

    $scope.getallcases();

    $scope.getawaitingpayment = async function () {
        await $http.get('/getawaitingpayment').then(function (response) {
            $scope.awaitingPayment = response.data;
        });
    }

    $scope.getawaitingpayment();

    // $scope.getProfilePic = function () {
    //     $http.get('/getprofilepic').then(function (response) {
    //         $scope.ImagePath = response.data;
    //     });
    // }

    // $scope.getProfilePic();

    $scope.btnAccept = function (complaintId) {
        alertify
            .okBtn("Accept")
            .cancelBtn("Deny")
            .confirm("By clicking this, you are accepting to handle this case", function (ev) {
                ev.preventDefault();
                alertify.success("Successful");
                setTimeout(() => {
                    var req = {
                        'complaintId': complaintId
                    };
                    $http.post('/createcase', req).then(function (response) {
                        if (response.data.status == 1) {
                            $window.location = "/case/" + response.data.message;
                        }
                        if (response.data.status == 0) {
                            toastr["error"]("Error," + response.data.message);
                        }
                    });
                }, 2000);
            }, function (ev) {
                ev.preventDefault();
                alertify.error("You've Cancelled Request");
            });
    }

    $scope.btnCase = function (caseId) {
        $scope.start();
        $state.transitionTo('case', { id: caseId }, {
            reload: true,
            // inherit: false,
            notify: true
        });
    }

    $scope.UploadPic = function (complaintId) {
        var req = {
            'File': $scope.file
        }
        $http.post('/uploadpic', req).then(function (response) {
            if (response.data.status == 1) {
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            }
            if (response.data.status == 0) {
                toastr["error"]("Error," + response.data.message);
            }
        });
    }
    $scope.UploadPic();

    $scope.btnGetComplaintData = function (e) {
        var newArray = $scope.allcomplaints.filter(function (x) {
            return x._id == e
        });
        $scope.displayComplaintData = newArray;
    }

    $scope.AcceptCase = function (e) {
        $('#divLoading').css('display', 'block');
        setTimeout(() => {
            $('#divLoading').css('display', 'none');
            $('#AcceptanceModal').modal('show');
            $('#AcceptanceModal').modal('toggle');
        }, 2000);
        $scope.complaintId = e;
    }

    $scope.btnAcceptCase = function (e) {
        var a = {
            'cost': $scope.cost,
            'estNoDays': $scope.estNoDays
        }
        $http.post('/addcasepayment/' + e, a).then(function (response) {
            if (response.data == 1) {
                toastr.success('Case Accepted! Once payment is confirmed by the user, we will automatically redirect you to the case portal');
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
                $('#myModal').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                // document.getElementById(response.key).scrollIntoView();
            }
            else {
                toastr["error"]("Error," + " " + "Something went wrong!!!");
            }
        });
    }

    $scope.DeclineCase = function (e) {
        $('#divLoading').css('display', 'block');
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
                toastr.success('Case Removed Successfully!');
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
                $('#myModal').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                // document.getElementById(response.key).scrollIntoView();
            }
            else {
                toastr["error"]("Error," + " " + "Something went wrong!!!");
            }
        });
    }

    $scope.getUser = async function () {
        await $http.get('/user').then(function (response) {
            if (response.data === 0) $scope.showUserName = 'Fake User';
            else {
                $scope.showUserName = response.data;
            }
        })
    }

    $scope.btnUploadMedCert = function () {
        var x = document.getElementById("medCert");
        var formData = new FormData();
        var file = x.files[0];
        formData.append('MediatorCert', file);
        $.ajax({
            url: '/uploadmediatorcert',
            type: "POST",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response == 1) {
                    toastr.success('Uploaded!');
                    // $state.transitionTo($state.current, $stateParams, {
                    //     reload: true,
                    //     inherit: false,
                    //     notify: true
                    // });
                }
            }
        })
        return false;
    }

    $scope.getMediatorData = async function () {
        await $http.get('/getmediatordata').then(function (response) {
            $scope.mediatorData = response.data;
        });
    }
    $scope.getMediatorData();

    $scope.getExistingMediatorProfile = async function () {
        await $http.get('/existingmediatorprofile').then(function (response) {
            $scope.existingProfile = response.data;
            if (response.data !== null) {
                $scope.firstname = response.data.FirstName;
                $scope.lastname = response.data.LastName;
                $scope.othernames = response.data.OtherNames;
                $scope.bio = response.data.MiniBio;
                $scope.phone = response.data.Phone;
                $scope.address = response.data.Address;
            }
        });
    }
    $scope.getExistingMediatorProfile();

    $scope.btnSaveMediatorProfile = function () {
        $('#btnUpdateProfile').prop('disabled', true);
        var x = document.getElementById("medCert");
        var formData = new FormData();
        var file = x.files[0];
        if (file === undefined && document.getElementById('medCertImage').src === undefined) {
            toastr["error"]("Error," + " " + "Please select a valid file");
            return;
        }
        formData.append('MediatorCert', file);
        formData.append('FirstName', $('#firstname').val());
        formData.append('LastName', $('#lastname').val());
        formData.append('OtherNames', $('#othernames').val());
        formData.append('Address', $('#address').val());
        formData.append('MiniBio', $('#bio').val());
        formData.append('Phone', $('#phone').val());
        $.ajax({
            url: '/createmediatorprofile',
            type: "POST",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response == 1) {
                    toastr.success('Profile Updated Successfully!');
                    setTimeout(() => {
                        location.href = '/mediator-profile';
                    }, 1000);

                    // $state.transitionTo($state.current, $stateParams, {
                    //     reload: true,
                    //     inherit: false,
                    //     notify: true
                    // });
                }
            }
        });
    }

    $scope.getUser();

    $scope.start = function () {
        cfpLoadingBar.start();
    };
    $scope.complete = function () {
        cfpLoadingBar.complete();
    }
    // $scope.start();
    // $scope.fakeIntro = true;
    // $timeout(function () {
    //     $scope.complete();
    //     $scope.fakeIntro = false;
    // }, 750);
    // $scope.complete();
}]);