myApp.controller('layoutController', ['$scope', '$state', '$stateParams', 'cfpLoadingBar', '$http', '$timeout', '$location', '$anchorScroll', '$window', function ($scope, $state, $stateParams, cfpLoadingBar, $http, $timeout, $location, $anchorScroll, $window) {
    $scope.redirectToLogin = function () {
        $window.location.href = '/login';
    }

    $scope.logout = function () {
        $http.post('/logout').then(function(response){
            if (response.data == 1) window.location = '/';
        });
    }

    var currentId = $stateParams.id;
    $scope.getUser = function () {
        // $scope.start();
        $http.get('/user').then(function (response) {
            // console.log(response.data);
            if (response.data === 0) window.location = '/';
            else {
                $scope.showUserName = response.data;
                // $scope.page = 'user';
            }
        })
    }

    $scope.getUser();

    $scope.start = function () {
        cfpLoadingBar.start();
    };
    $scope.complete = function () {
        cfpLoadingBar.complete();
    }
    // fake the initial load so first time users can see it right away:

    // $scope.start();
    // $scope.fakeIntro = true;
    // $timeout(function () {
    //     $scope.complete();
    //     $scope.fakeIntro = false;
    // }, 750);

    // $scope.getUser();
    // $scope.complete();

}])