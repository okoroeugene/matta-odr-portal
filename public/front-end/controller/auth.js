myApp.controller('authController', ['$scope', '$state', '$stateParams', '$http', '$timeout', '$location', '$anchorScroll', '$window', function ($scope, $state, $stateParams, $http, $timeout, $location, $anchorScroll, $window) {

    // $scope.getUser();
    $scope.checkCode = function () {
        var data = {
            'FileCode': $scope.filecode
        };
        $http.post('/checkcode', data).then(function (response) {
            if (response.data == 1) $window.location = '/new-complaint';
            if (response.data.status == 2) $window.location = '/case/' + response.data.id;
            if (response.data.status == 3) $window.location = response.data.url;
            if (response.data.status == 4) $window.location = '/case/' + response.data.caseId;
            else toastr["error"]("Error, Invalid Code!");
            // toastr.success('Submitted!');
        })
            .catch(function (err) {
                // Log error somehow.
            })
            .finally(function () {
                // Hide loading spinner whether our call succeeded or failed.
                // usSpinnerService.stop();
            });
    }

    $scope.btnReg = function () {
        $('#btnReg').prop('disabled', true);
        var data = {
            'email': $scope.email,
            'password': $scope.password,
            'fullname': $scope.fullname,
        };
        $http.post('/register', data).then(function (response) {
            if (response.data == 1) {
                window.location.href = '/profile';
            }
            else{
                $('#btnReg').prop('disabled', false);
                toastr["error"]("Error," + " " + response.data);
            }
        })
    }


    $scope.btnLogin = function () {
        // flash.setMessage(message);
        // $location.path("/login");
        var data = {
            'email': $scope.email,
            'password': $scope.password
        };
        $http.post('/login', data).then(function (response) {
            if (response.data.success == false) {
                toastr["error"]("Error," + " " + "Invalid Username or Password");
            }
            if (response.data.success == true) {
                if (response.data.url != undefined)
                    window.location.href = response.data.url;
                else
                    window.location.href = '/profile';
            }

            // toastr.success('Submitted!');
        })
    }

    $scope.getFileNumber = async function () {
        await $http.get('/getNewRegData').then(function (response) {
            $scope.newFileCode = response.data;
        });
    };
    $scope.getFileNumber();

    $scope.btnOpenFile = function () {
        $('#btnOpenFile').prop('disabled', true);
        var a = {
            'password': $scope.password
        }
        $http.post('/openfile', a).then(function (response) {
            if (response.data == 1) {
                toastr.success('Successful!');
                setTimeout(() => {
                    window.location.href = '/new-complaint';
                }, 1000);
            }
        })
    }
}]);

