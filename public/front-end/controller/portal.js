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

    $scope.PaymentStatusInit = function () {
        $scope.verifyPayment = function () {
            $http.get('/verifypayment').then(function (response) {
                if (response.data.status == 1) {
                    $scope.result = response.data.result;
                    $scope.mediatorname = response.data.mediator;
                    $scope.caseId = response.data.caseId;
                    $scope.PaidandAccepted = true;
                    $scope.Paid = true;
                }
                if (response.data.status == 0) {
                    $scope.NotAssignedPayment = true;
                }
                if (response.data.status == 2) {
                    $scope.AssignedPayment = true;
                    $scope.result = response.data.result;
                }
            });
        }
        $scope.verifyPayment();
    }



    $scope.btnGotoCase = function (res) {
        window.location.href = '/case/' + res;
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