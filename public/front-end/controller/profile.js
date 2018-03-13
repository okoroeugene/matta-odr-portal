myApp.controller('profileController', ['$scope', '$state', '$stateParams', 'cfpLoadingBar', '$http', '$timeout', '$location', '$anchorScroll', '$window', function ($scope, $state, $stateParams, cfpLoadingBar, $http, $timeout, $location, $anchorScroll, $window) {

    var currentId = $stateParams.id;

    $scope.Complaints = function () {
        $http.get('/complaints').then(function (response) {
            // console.log(response.data);
            if (response.data === 0) window.location = '/';
            else {
                $scope.allcomplaints = response.data;
            }
        })
    }

    $scope.Complaints();

    $scope.getallcases = function(){
        $http.get('/getallcases').then(function (response) {
            $scope.allcases = response.data;
        });
    }

    $scope.getallcases();

    $scope.btnAccept = function (complaintId) {
        swal({
            title: "Accept?",
            text: "By clicking this, you are accepting to handle this case",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55", confirmButtonText: "Yes, continue!",
            cancelButtonText: "No, cancel!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {
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
                } else {
                    swal("Cancelled", "Your cancelled :)", "error");
                }
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