myApp.controller('layoutController', ['$scope', '$state', '$stateParams', 'cfpLoadingBar', '$http', '$timeout', '$location', '$anchorScroll', '$window', function ($scope, $state, $stateParams, cfpLoadingBar, $http, $timeout, $location, $anchorScroll, $window) {
    var socket = io.connect('http://localhost:3005');
    // var socket = io.connect('https://matta.herokuapp.com');
    $scope.redirectToLogin = function () {
        $window.location.href = '/login';
    }

    $scope.logout = function () {
        $http.post('/logout').then(function (response) {
            if (response.data == 1) window.location = '/';
        });
    }

    var currentId = $stateParams.id;
    $scope.getUser = async function () {
        await $http.get('/user').then(function (response) {
            if (response.data === 0) $scope.showUserName = 'Fake User';
            else {
                $scope.showUserName = response.data;
            }
        })
    }
    $scope.getUser();

    $scope.getuserId = async function () {
        await $http.get('/getuserid').then(function (response) {
            $scope.userId = response.data;
        });
    }
    $scope.getuserId();

    $scope.getProfilePic = function () {
        $http.get('/getprofilepic').then(function (response) {
            $scope.profilePic = response.data;
        });
    }
    $scope.getProfilePic();

    socket.on('notifyCount', function (data, sendername, content, participantId, allData, currentCount) {
        var myContent;
        $('#toBottom_' + participantId).css('display', 'block');
        $('#showCount_' + participantId).val(currentCount);
        // console.log(currentCount);
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
        setTimeout(() => {
            $('#showColor1_' + allData._id).css('background-color', '#fffdce');
            $('#showColor2_' + allData._id).css('background-color', '#fffdce');
        }, 1000);
        setTimeout(() => {
            $('#showColor1_' + allData._id).css('background-color', 'transparent');
            $('#showColor2_' + allData._id).css('background-color', '#f4f4f4');
        }, 3000);
        var html = '<div class="cd-timeline-block" id="showColor1_' + allData._id + '">' +
            '<div style="background-color: #2edc3b!Important;"' +
            'style="background-color:#7f8c8d!Important;" class="cd-timeline-icon bg-purple text-white">' +
            '<span class="userText" style="font-size: 14px;position:relative;top:5px;">' + 'new' + '</span>' +
            '</div>' +
            '<div class="cd-timeline-content" id="showColor2_' + allData._id + '">' +
            '<a href="#">' +
            '<h4 ng-if="data.SenderName != null" style="font-size: 1.3rem!Important;">' + sendername + '</h4>' +
            '</a>' +
            '<p>' +
            '<div id="txtChatContent_{{data._id}}" ng-if="data.Content != null">' + allData.Content + '</div>' +
            '<div class="">' +
            '<div ng-if="data.File.length === 1">' +
            // '<div class="col-md-12" ng-if="' + content[0].ChatId.File != null + '" ng-repeat="(key, value) in data.File track by $index">' +
            // '<img id="myImg" ng-click="myImg(value.filename)" class="img-responsive img-thumbnail" style="object-fit:contain; width:100%; display:block; margin: 0 auto; height:180px;"' +
            // 'src="../uploads/{{value.filename}}">' +
            // '</div>' +
            '</div>' +
            '</div>' +
            '</p>' +
            '<span style="font-size: 11px;color: #7b7979;font-style: italic;" class="cd-date">' + allData.Date + '</span>' +
            '</div>' +
            '</div>';
        var wrapper = $('#contentContainer_' + participantId);
        wrapper.append(html);
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

    $scope.btnHome = function () {
        $window.location.href = '/';
    }

    // $scope.navigateToChat = function (e, caseId) {
    //     $state.transitionTo('case', { id: e, ref: caseId });
    // }

    $scope.PaymentStatusInit = function () {
        $scope.verifyPayment = function () {
            $http.get('/verifypayment').then(function (response) {
                if (response.data.status == 1) {
                    $scope.caseId = response.data.caseId;
                }
            });
        }
        $scope.verifyPayment();
    }

    $scope.getRole = function () {
        $http.get('/userrole').then(function (response) {
            $scope.role = response.data;
        });
    }
    $scope.getRole();

    $scope.btnGotoCase = function (res) {
        window.location.href = '/case/' + res;
    }

    $scope.btnOpenFile = function () {
        window.location.href = '/open-file';
    }

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