myApp.controller('authController', ['$scope', '$state', '$stateParams', '$http', '$timeout', '$location', '$anchorScroll', '$window', function ($scope, $state, $stateParams, $http, $timeout, $location, $anchorScroll, $window) {
    var currentId = $stateParams.id;
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
            'firstname': $scope.firstname,
            'lastname': $scope.lastname,
        };
        $http.post('/register', data).then(function (response) {
            if (response.data == 1) {
                window.location.href = '/profile';
            }
            else {
                $('#btnReg').prop('disabled', false);
                toastr["error"]("Error," + " " + response.data);
            }
        })
    }


    $scope.btnLogin = function () {
        $('#btnLogin').prop('disabled', true);
        $('#btnLogin').addClass('active');
        var data = {
            'username': $scope.username,
            'password': $scope.password
        };
        $http.post('/login', data).then(function (response) {
            if (response.data.success == false) {
                toastr["error"]("Error," + " " + "Invalid Username or Password");
                $('#btnLogin').prop('disabled', false);
                $('#btnLogin').removeClass('active');
            }
            if (response.data.success == true) {
                if (response.data.url != undefined)
                    window.location.href = response.data.url;
                else {
                    if (response.data.role === 'user') window.location.href = '/pending';
                    if (response.data.role === 'mediator') window.location.href = '/profile';
                    if (response.data.role === 'invitee') window.location.href = '/pending';
                    if (response.data.role === 'admin') window.location.href = '/admin';
                }
            }
        });
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
                    $window.location.href = '/new-complaint';
                }, 1000);
            }
        })
    }

    $scope.GetInviteeData = function () {
        $http.get('/getInvitee/' + currentId).then(function (response) {
            if (response.data.userId.password !== '000000') location.href = '/login';
            else if (response.data.userId.password === '000000') {
                $scope.InviteeData = response.data;
                $scope.secretToken = response.data.SecretToken;
            }
        });
    }

    $scope.GetUserData = function () {
        $http.get('/GetUserDataByToken/' + currentId).then(function (response) {
            if (response.data === 0) location.href = '/login';
            else {
                $scope.userData = response.data;
            }
        });
    }

    $scope.btnRegInvitee = function () {
        var data = {
            'password': $scope.password,
        };
        $('#btnRegInvitee').prop('disabled', true);
        $http.post('/regInvitee/' + currentId, data).then(function (response) {
            if (response.data === 0) {
                $('#btnRegInvitee').prop('disabled', false);
                toastr["error"]("Error, Something went wrong!");
            }
            else {
                toastr.success('Successful!');
                setTimeout(() => {
                    location.href = '/case/' + response.data;
                }, 1000);
            }
        });
    }

    $scope.btnForgotPassword = function () {
        var data = {
            'username': $scope.username,
        };
        $('#btnForgotPassword').prop('disabled', true);
        $http.post('/forgotpassword', data).then(function (response) {
            if (response.data === 0) {
                $('#btnForgotPassword').prop('disabled', false);
                toastr["error"]("Error, Something went wrong!");
            }
            else {
                toastr.success('Successful! Please check your mail for the password reset link.');
            }
        });
    }

    $scope.btnResetPassword = function () {
        var data = {
            'password': $scope.password,
        };
        $('#btnResetPassword').prop('disabled', true);
        $http.post('/resetpassword/' + currentId, data).then(function (response) {
            if (response.data === 0) {
                $('#btnResetPassword').prop('disabled', false);
                toastr["error"]("Error, Something went wrong!");
            }
            else {
                toastr.success('Successfully Reset!');
                setTimeout(() => {
                    location.href = '/login';
                }, 1000);
            }
        });
    }
}]);

