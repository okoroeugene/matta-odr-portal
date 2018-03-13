myApp.controller('layoutController', ['$scope', '$state', '$stateParams', 'cfpLoadingBar', '$http', '$timeout', '$location', '$anchorScroll', '$window', function ($scope, $state, $stateParams, cfpLoadingBar, $http, $timeout, $location, $anchorScroll, $window) {
    $scope.redirectToLogin = function () {
        $window.location.href = '/login';
    }

    $scope.logout = function () {
        $http.post('/logout').then(function (response) {
            if (response.data == 1) window.location = '/';
        });
    }

    var currentId = $stateParams.id;
    $scope.getUser = function () {
        $http.get('/user').then(function (response) {
            if (response.data === 0) $scope.showUserName = 'Fake User';
            else {
                $scope.showUserName = response.data;
            }
        })
    }
    $scope.getUser();

    var socket = io.connect('http://localhost:3005');
    socket.on('notifyCount', function (data, sendername, content) {
        var myContent;
        if (content === null) myContent = 'Sent an Attachment';
        else myContent = content;
        $('.notification-counter').html(data.count);
        $('.notification-counter').css('display', 'block');
        // $scope.myNotification = true;
        toastr["success"](myContent, sendername)
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "progressBar": false,
            "positionClass": "toast-bottom-left",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
    });

    $scope.notification = function () {
        $http.get('/notificationcount').then(function (response) {
            $scope.notificationData = 0;
            $scope.notificationData = response.data;
            if (response.data.count > 0)
                $('.notification-counter').css('display', 'block');
        })
        // var socket = io.connect('http://localhost:3005');
        // socket.on('notifyCount', function (data) {
            
        //     socket.emit('notify');
        // });
    }

    $('#readNotification').click(function () {
        $http.post('/markasread').then(function (response) {
            if (response.data == 1) {
                // $scope.myNotification = false;
                $('.notification-counter').css('display', 'none');
            }
        });
    });

    $scope.notification();

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