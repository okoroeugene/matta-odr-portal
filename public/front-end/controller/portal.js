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


    // $scope.complete();
}]);