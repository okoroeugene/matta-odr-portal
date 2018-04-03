myApp.controller('adminController', ['$scope', '$state', '$stateParams', '$http', '$timeout', '$location', '$anchorScroll', '$window', function ($scope, $state, $stateParams, $http, $timeout, $location, $anchorScroll, $window) {
    // var currentId = $stateParams.id;
    // $scope.getUser = function () {
    //     // $scope.start();
    //     $http.get('/user').then(function (response) {
    //         // console.log(response.data);
    //         if (response.data === 0) window.location = '/';
    //         else {
    //             $scope.showUserName = response.data;
    //             // $scope.page = 'user';
    //         }
    //     })
    // }

    // $scope.getUser();

    $scope.getAllCases = function () {
        $http.get('/allcomplaints').then(function (response) {
            $scope.complaints = response.data;
        });
    }
    $scope.getAllCases();

    $scope.getMediators = function () {
        $http.get('/allmediators').then(function (response) {
            $scope.mediators = response.data;
        });
    }
    $scope.getMediators();

    // $scope.getMediatorName = function (res) {
    //     $http.get('/getMediatorName/' + res).then(function (response) {
    //         $scope.mediatorName = response.data;
    //     });
    // }

    $scope.btnView = function (res) {
        $scope.imgPath = null;
        $http.get('/GetMediatorDataById/' + res).then(function (response) {
            if (response.data.Image !== null) $scope.imgPath = response.data.Image;
            if (response.data.MedProfileData === null) {
                $scope.hasData = false;
                $scope.noData = true;
            }
            else {
                $scope.hasData = true;
                $scope.noData = false;
                $scope.mediatordata = response.data;
            }
        });
    }

    $scope.btnViewComplaint = function (res) {
        $http.get('/getcomplaintdata/' + res).then(function (response) {
            $scope.complaintdata = response.data;
            // $scope.mediatorName = response.data.MedaiatorName;
        });
    }

    $scope.btnAssignPayment = function (res) {
        var a = {
            'cost': $scope.cost
        }
        $http.post('/addcasepayment/' + res, a).then(function (response) {
            if (response.data == 1) {
                toastr.success('Payment Assigned');
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
                $('#myModal').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                document.getElementById(response.key).scrollIntoView();
            }
            else {
                toastr["error"]("Error," + " " + "Something went wrong!!!");
            }
        });
    }

    $scope.btnVerify = function (e) {
        $http.post('/verifymediator/' + e).then(function (response) {
            if (response.data === 1) {
                toastr.success('Verified!');
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
                $('#myModal').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
            }
            else toastr["error"]("Error," + " " + "Something went wrong!!!");
        });
    }

    $scope.btnUnVerify = function (e) {
        $http.post('/unverifymediator/' + e).then(function (response) {
            if (response.data === 1) {
                toastr.success('UnVerified!');
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
                $('#myModal').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
            }
            else toastr["error"]("Error," + " " + "Something went wrong!!!");
        });
    }

    $scope.myImg = function (imgSrc) {
        // $('#divLoading').css('display', 'block');
        $('#myModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        var modal = document.getElementById('myImgModal');
        var modalImg = document.getElementById("img01");
        var captionText = document.getElementById("caption");
        modal.style.display = "block";
        modalImg.src = '../uploads/' + imgSrc;
        var span = document.getElementsByClassName("close")[0];
        span.onclick = function () {
            modal.style.display = "none";
        }
    }
    // $scope.complete();
}]);