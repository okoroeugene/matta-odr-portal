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

    $scope.allData = [];
    $scope.filteredData = [];
    $scope.itemsPerPage = 5;
    $scope.currentPage = 1;
    $scope.chats = [];
    $scope.getCaseChat = function () {
        $http.get('/casechat/' + currentId).then(function (response) {
            $scope.chats = response.data;
        });
    }

    $scope.chatDisplay = function () {
        var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
        var end = begin + $scope.itemsPerPage;
        console.log(begin);

        $timeout(function () {
            $scope.complete();
            $('#container').removeClass('parentDisable');
            $('.loader').css('display', 'none');
            $scope.filteredData = $scope.chats.slice(begin, end);
            $scope.contentLoader = false;
            $scope.textContent = true;
            $("html, body").animate({ scrollTop: 0 }, "slow");
            return false;
        }, 6000);
    };
    $scope.getCaseChat();
    $scope.chatDisplay();
    $scope.pageChanged = function () {
        $('#container').addClass('parentDisable');
        $('.loader').css('display', 'block');
        $scope.chatDisplay();
    };

    // $scope.filteredTodos = []
    //     , $scope.currentPage = 1
    //     , $scope.numPerPage = 10
    //     , $scope.maxSize = 5;

    // $scope.makeTodos = function () {
    //     $scope.todos = [];
    //     for (i = 1; i <= 1000; i++) {
    //         $scope.todos.push({ text: "todo " + i, done: false });
    //     }
    // };
    // $scope.makeTodos();

    // $scope.$watch("currentPage + numPerPage", function () {
    //     var begin = (($scope.currentPage - 1) * $scope.numPerPage)
    //         , end = begin + $scope.numPerPage;

    //     $scope.filteredTodos = $scope.todos.slice(begin, end);
    // });

    // var counter = 0;
    // $scope.newData = [];
    // $(window).scroll(function () {
    //     if ($(document).height() - 50 <= $(window).scrollTop() + $(window).height()) {
    //         console.log($scope.allData);
    //         var newCounter = counter + 5;
    //         for (var i = counter; i < $scope.allData.length; i++) {
    //             if ($scope.allData[i].Index >= counter && $scope.allData[i].Index <= newCounter)
    //             $scope.newData.push($scope.allData[i].Data);
    //         }
    //     }
    //     $scope.newData();
    // });

    $scope.btnInvite = function (caseId) {
        var req = {
            'caseId': caseId
        }
        $http.post('/InviteThirdParty', req).then(function (response) {
            if (response.data.status == 1) toastr.success('Invite sent!');
            if (response.data.status == 0) toastr["error"]("Error," + " " + response.data.message);
        });
    }

    $scope.myImg = function (imgSrc) {
        var modal = document.getElementById('myImgModal');
        // Get the image and insert it inside the modal - use its "alt" text as a caption
        var modalImg = document.getElementById("img01");
        var captionText = document.getElementById("caption");
        modal.style.display = "block";
        modalImg.src = '../uploads/' + imgSrc;
        // captionText.innerHTML = this.alt;

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }
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
    var formData = new FormData();
    $("document").ready(function () {
        $("#previewFile").change(function () {
            // $scope.fileLoad = true;
            for (var i = 0; i < $(this).get(0).files.length; ++i) {
                $('div.progress').show();
                var file = $(this).get(0).files[i];
                // files.push($(this).get(0).files[i]);
                formData.append('uploadfile', file);
                // $scope.fileLoad = false;
                // $scope.fileLoaded = true;
                $('#previewContent').css('display', 'block');
                $('#preview').append("<div class='col-md-3 col-sm-6 col-xs-6'>" +
                    "<img id='upload' class='img-responsive img-thumbnail' style='width: 120px; height: 120px; object-fit: contain' src='" + URL.createObjectURL(file) + "'>" +
                    "</div>");
            }
        });
    });

    $('#uploadFile').click(function () {
        var caseId = $('#caseId').val();
        $(this).prop('disabled', true);
        $(this).css('opacity', '0.5');
        var caption = $('#caption').val();
        formData.append('caption', $('#caption').val());
        var xhr = new XMLHttpRequest();
        xhr.open('post', 'uploadfile/', true);
        xhr.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                var percentage = (e.loaded / e.total) * 100;
                $('div.progress div').css('width', percentage.toFixed(0) + '%');
                $('div.progress div').html(percentage.toFixed(0) + '%');
            }
        };
        xhr.onerror = function (e) {
            alert('An error occurred while submitting the form. Maybe your file is too big');
        };
        xhr.onload = function () {
            var file = xhr.responseText;
            $('div.progress div').css('width', '0%');
            $('div.progress').hide();
        };
        xhr.send(formData);
        $.ajax({
            url: '/uploadfile/' + caseId,
            type: "POST",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.status == 1) {
                    toastr.success('Submitted!');
                    $state.transitionTo($state.current, $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                    $('#myModal').modal('hide');
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                    document.getElementById(response.key).scrollIntoView();
                }
                if (response.status == 0) toastr["error"]("Error," + response.data.message);
            }
        })
        return false;
    })

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