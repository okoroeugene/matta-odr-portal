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


    $scope.btnLogin = function () {
        // flash.setMessage(message);
        // $location.path("/login");
        var data = {
            'email': $scope.email,
            'password': $scope.password
        };
        $http.post('/login', data).then(function (response) {
            console.log(response);
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
}]);

