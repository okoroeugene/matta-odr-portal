myApp.controller('caseController', ['$scope', '$state', '$stateParams', 'cfpLoadingBar', '$http', '$timeout', '$location', '$anchorScroll', '$window', function ($scope, $state, $stateParams, cfpLoadingBar, $http, $timeout, $location, $anchorScroll, $window) {
    $scope.contentLoader = true;
    $scope.userLoader = true;
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

    $scope.Complaints = function () {
        $http.get('/complaints').then(function (response) {
            if (response.data === 0) window.location = '/';
            else {
                $scope.allcomplaints = response.data;
            }
        })
    }

    $scope.Complaints();

    $scope.btnChat = function () {
        $scope.searchButtonText = "chat";
        // $scope.start();
        var content = $('.note-editable').text();
        var data = {
            'Content': content,
        };
        $http.post('/addchat/' + currentId, data).then(function (response) {
            if (response.data.status == 1) {
                toastr.success('Submitted!');
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
                $('#myModal').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                document.getElementById(response.data.key).scrollIntoView()
            }

            if (response.data.status == 0) toastr["error"]("Error," + response.data.message);
        });
    };

    $scope.getCaseData = function () {
        $http.get('/casedata/' + currentId).then(function (response) {
            $timeout(function () {
                $scope.showData = response.data;
                $scope.userLoader = false;
                $scope.userData = true;
            }, 6000);


        });
    }
    $scope.getCaseData();

    $scope.getCaseChat = function () {
        $http.get('/casechat/' + currentId).then(function (response) {
            $scope.complete();
            $timeout(function () {
                $scope.showChat = response.data;
                $scope.contentLoader = false;
                $scope.textContent = true;
            }, 6000);
        });
    }
    $scope.getCaseChat();

    $scope.btnInvite = function (caseId) {
        var req = {
            'caseId': caseId
        }
        $http.post('/InviteThirdParty', req).then(function (response) {
            if (response.data.status == 1) toastr.success('Invite sent!');
            if (response.data.status == 0) toastr["error"]("Error," + " " + response.data.message);
        });
    }

    $scope.getrole = function () {
        $http.get('/getroles').then(function (response) {
            $scope.role = response.data.role;
        });
    }
    $scope.getrole();

    $scope.checkInvite = function () {
        $http.get('/checkinvite/' + currentId).then(function (response) {
            if (response.data == 1) $scope.IsInvited = true;
            else $scope.IsInvited = false;
        });
    }
    $scope.checkInvite();

    // var files = [];
    // $("document").ready(function () {
    //     $("#previewFile").change(function () {
    //         $scope.fileLoad = true;
    //         for (var i = 0; i < $(this).get(0).files.length; ++i) {
    //             var file = $(this).get(0).files[i];
    //             files.push($(this).get(0).files[i]);
    //             $scope.fileLoad = false;
    //             $scope.fileLoaded = true;
    //             $('#preview').append("<div class='col-md-3 col-sm-6 col-xs-6'>" +
    //                 "<img id='upload' class='img-responsive img-thumbnail' style='width: 120px; height: 120px; object-fit: contain' src='" + URL.createObjectURL(event.target.files[i]) + "'>" +
    //                 "</div>");
    //         }
    //     });
    // });

    // $scope.btnUpload = function () {
    //     // var names = [];
    //     //     for (var i = 0; i < $(upload).get(0).files.length; ++i) {
    //     //         var reader = new FileReader();
    //     //         console.log(URL.createObjectURL($(this).get(0).files[i]));
    //     //         // names.push($(this).get(0).files[i]);
    //     //     }
    //     var req = {
    //         'files': files,
    //         'caption': $scope.caption
    //     }
    //     console.log(req);
    //     // $.ajax({
    //     //     type: "POST",
    //     //     url: '/uploadfile',
    //     //     contentType: false,
    //     //     processData: false,
    //     //     data: req,
    //     //     success: function (result) {
    //     //         console.log(result);
    //     //     },
    //     //     error: function (xhr, status, p3, p4) {
    //     //         var err = "Error " + " " + status + " " + p3 + " " + p4;
    //     //         if (xhr.responseText && xhr.responseText[0] == "{")
    //     //             err = JSON.parse(xhr.responseText).Message;
    //     //         console.log(err);
    //     //     }
    //     // });
    //     var fd = new FormData();
    //        fd.append('req', req);
    //        console.log(fd);
    //     $http.post('/uploadfile', fd).then(function (response) {
    //         console.log(response.data);
    //         $scope.previewFile = response.data;
    //     });
    // }

    $scope.start = function () {
        cfpLoadingBar.start();
    };
    $scope.complete = function () {
        cfpLoadingBar.complete();
    }
    // $scope.fakeIntro = true;
    // $timeout(function () {
    //     $scope.complete();
    //     $scope.fakeIntro = false;
    // }, 750);
}]);