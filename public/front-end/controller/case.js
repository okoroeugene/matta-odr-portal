myApp.controller('caseController', ['$scope', '$state', '$stateParams', 'cfpLoadingBar', '$http', '$timeout', '$location', '$anchorScroll', '$window', function ($scope, $state, $stateParams, cfpLoadingBar, $http, $timeout, $location, $anchorScroll, $window) {
    var socket = io.connect('http://localhost:3005');
    // var socket = io.connect('https://matta.herokuapp.com');
    $scope.contentLoader = true;
    $scope.userLoader = true;
    var currentId = $stateParams.id;

    $scope.Complaints = async function () {
        await $http.get('/complaints').then(function (response) {
            if (response.data === 0) window.location = '/';
            else {
                $scope.allcomplaints = response.data;
            }
        })
    }

    $scope.Complaints();

    $scope.$on('$viewContentLoaded', function () {
        //Here your view content is fully loaded !!
        console.log('loaded');
    });

    $scope.btnChat = function () {
        $scope.searchButtonText = "chat";
        // $scope.start();
        var content = $('.note-editable').html();
        if ($.trim($(".note-editable").html()) == '') {
            toastr["error"]("Error," + " " + "Please enter a valid text...");
            return;
        }

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
                socket.emit('notify', response.data.result.CaseId, response.data.result.SenderId,
                    response.data.result.SenderName, response.data.result.Content, response.data.result);

                $('#myModal').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                setTimeout(() => {
                    document.getElementById(response.data.result._id).scrollIntoView();
                }, 0);

                // document.getElementById(response.data.result._id).scrollIntoView()
            }

            if (response.data.status == 0) toastr["error"]("Error," + response.data.message);
        });
    };

    $scope.btnChat2 = function () {
        // $scope.searchButtonText = "chat";
        var content = $('#txtContent2').val();
        if ($.trim($('#txtContent2').val()) == '') {
            toastr["error"]("Error," + " " + "Please enter a valid text...");
            return;
        }

        var data = {
            'Content': content,
        };
        $http.post('/addchat/' + currentId, data).then(function (response) {
            if (response.data.status == 1) {
                toastr.success('Submitted!');
                $state.transitionTo($state.current, { id: response.data.result.CaseId }, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
                socket.emit('notify', response.data.result.CaseId, response.data.result.SenderId,
                    response.data.result.SenderName, response.data.result.Content, response.data.result);

                setTimeout(() => {
                    document.getElementById(response.data.result._id).scrollIntoView();
                }, 0);
            }
            if (response.data.status == 0) toastr["error"]("Error," + response.data.message);
        });
    };

    $scope.getCaseData = async function () {
        await $http.get('/casedata/' + currentId).then(function (response) {
            // $timeout(function () {

            // }, 6000);
            var div = $('#btnViewCaseToggle');
            $scope.showData = response.data;
            $scope.getrole();
            if (response.data.ComplaintId.Status === '1') $scope.showBtn = true;
            if (response.data.ComplaintId.Status === '2') {
                div.addClass('btnRadius');
                $scope.showBtn = false;
            }
            else if (userRole === 'user') {
                // div.removeClass('btnRadius');
                $scope.userBtn = true;
            }
            else {
                $('#statusBtn').addClass('btn-default');
            }
            $scope.userLoader = false;
            $scope.userData = true;
        });
    }
    $scope.getCaseData();

    $scope.allData = [];
    $scope.filteredData = [];
    $scope.itemsPerPage = 10;
    $scope.currentPage = 1;
    $scope.chats = [];
    $scope.getCaseChat = async function () {
        await $http.get('/casechat/' + currentId).then(function (response) {
            $scope.chats = response.data;
            $scope.chatDisplay();
        });
    }
    $scope.getCaseChat();

    var sIndex = 11, offSet = 10, isPreviousEventComplete = true, isDataAvailable = true;
    $('#chatBox').scroll(function () {
        // console.log($('#chatBox').scrollTop());
        if ($('#chatBox').scrollTop() <= 50) {
            // console.log(isPreviousEventComplete, isDataAvailable)
            if (isPreviousEventComplete && isDataAvailable) {
                $scope.currentPage++;
                isPreviousEventComplete = false;
                $scope.chatDisplay();
            }
        };
    });

    // $scope.showPopover=false;   

    $scope.showMyPopover = function (e) {
        $scope.showPopoverIndex = false;
        $('#pop_' + e).css('display', 'none');
    }
    $scope.getPopOverData = function (e, name, index) {
        $http.get('/getpopoverdata/' + e).then(function (response) {
            $scope.showPopoverIndex = true;
            $scope.showPopoverIndex = index;
            // $('#pop_' + e).css('display', 'block');
            $scope.popover = {
                name: name,
                fileSrc: response.data.src,
                role: response.data.role
            };
        });
    }

    // $scope.showNotificationData = function (e, caseId) {
    //     $state.transitionTo('case', { id: caseId }, {
    //         reload: true,
    //         notify: true
    //     });
    // }

    $scope.chatDisplay = function () {
        // var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
        // var end = begin + $scope.itemsPerPage;
        if ($scope.chats.length >= 3) $('#imgLoader').css('display', 'block');
        $timeout(function () {
            if ($scope.currentPage > 1)
                $('#chatBox').scrollTop(1130);
            var begin = ($scope.currentPage * (-$scope.itemsPerPage));
            // var x;
            // if ($scope.chats.length < 10) x = 1;
            // else if ($scope.chats.length > 10) x = $scope.chats.length - begin;
            // var end = $scope.chats.length;
            if ($stateParams.ref !== undefined) {
                $scope.filteredData = $scope.chats;
                setTimeout(() => {
                    document.getElementById($stateParams.ref).scrollIntoView();
                }, 100);
            }
            else $scope.filteredData = $scope.chats.slice(begin);
            if ($scope.chats.length == $scope.filteredData.length) isDataAvailable = false;
            else isDataAvailable = true;
            $scope.scrollTrigger = $scope.chats;
            $scope.contentLoader = false;
            $scope.textContent = true;
            // return false;
            sIndex = sIndex + offSet;
            isPreviousEventComplete = true;
        }, 0);
    };
    $scope.getCaseChat();
    $scope.chatDisplay();


    // $scope.pageChanged = function () {
    //     $('#container').addClass('parentDisable');
    //     $('.loader').css('display', 'block');
    //     $scope.chatDisplay();
    // };

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
        $('#btnInvite').prop('disabled', true);
        var req = {
            'caseId': caseId
        }
        $http.post('/InviteThirdParty', req).then(function (response) {
            if (response.data.status == 1) {
                toastr.success('Invite sent!');
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
                $('#myModal').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
            }
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

    var userRole = null;
    $scope.getrole = function () {
        $http.get('/getroles').then(function (response) {
            $scope.role = response.data.role;
            userRole = response.data.role;
            if (response.data.role === 'user') {
                $scope.userBtn = true;
            }
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
                    $state.transitionTo($state.current, { id: response.result.CaseId }, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                    socket.emit('notify', response.result.CaseId, response.result.SenderId,
                        response.result.SenderName, response.result.Content);
                    $('#myModal').modal('hide');
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                    document.getElementById(response.key).scrollIntoView();
                }
                if (response.status == 0) toastr["error"]("Error," + response.message);
            }
        })
        return false;
    });

    $scope.btnCloseCase = function () {
        alertify
            .okBtn("Accept")
            .cancelBtn("Deny")
            .confirm("Are you sure you want to close this case?", function (ev) {
                ev.preventDefault();
                alertify.success("Case closed successful");
                // setTimeout(() => {
                //     var req = {
                //         'complaintId': complaintId
                //     };
                //     $http.post('/createcase', req).then(function (response) {
                //         if (response.data.status == 1) {
                //             $window.location = "/case/" + response.data.message;
                //         }
                //         if (response.data.status == 0) {
                //             toastr["error"]("Error," + response.data.message);
                //         }
                //     });
                // }, 2000);
            }, function (ev) {
                ev.preventDefault();
                alertify.error("You've Cancelled Request");
            });
    }

    $scope.btnMarkCaseAsResolved = function (e, caseId) {
        alertify
            .okBtn("Accept")
            .cancelBtn("Deny")
            .confirm("Are you sure you want to mark this case as RESOLVED?", function (ev) {
                ev.preventDefault();
                $http.post('/MarkAsResolved/' + e).then(function (response) {
                    if (response.data === 1) {
                        alertify.success("Successful");
                        setTimeout(() => {
                            $state.transitionTo('case', { id: caseId }, {
                                reload: true,
                                notify: true
                            });
                        }, 1000);
                    }
                    if (response.data === 0) {
                        toastr["error"]("Error," + response.data.message);
                    }
                });

            }, function (ev) {
                ev.preventDefault();
                alertify.error("You've Cancelled Request");
            });
    }

    $scope.getuserId = async function () {
        await $http.get('/getuserid').then(function (response) {
            $scope.userId = response.data;
        });
    }
    $scope.getuserId();

    $scope.btnEditContent = function (e) {
        $http.get('/GetChatDataById/' + e).then(function (response) {
            $scope.chatData = response.data;
            $("#contentUpdate").val(response.data.Content);
        });
    }

    $scope.btnDeleteContent = function (e) {
        alertify
            .okBtn("Yes, Delete!")
            .cancelBtn("Deny")
            .confirm("Are you sure you want to delete this message?", function (ev) {
                ev.preventDefault();
                $http.post('/DeleteChatContent/' + e).then(function (response) {
                    $('#removeChat_' + e).fadeOut();
                });
                alertify.success("Deleted successfully");
            }, function (ev) {
                ev.preventDefault();
                alertify.error("You've Cancelled Request");
            });
    }

    $scope.btnUpdateContent = function (e) {
        var p = {
            'Content': $('#contentUpdate').val()
        }
        $http.post('/updatechatcontent/' + e, p).then(function (response) {
            if (response.data === 1) {
                toastr.success('Updated!');
                $('#myEditContentModal').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                document.getElementById("txtChatContent_" + e).innerHTML = $('#contentUpdate').val();
                // console.log($('#contentUpdate').val())
                // document.getElementById(response.data._id).scrollIntoView();
            }
            else toastr["error"]("Error," + " " + "Something went wrong!");
        });
    }

    // $scope.getRole = function () {
    //     $http.get('/userrole').then(function (response) {
    //         $scope.role = response.data;
    //     });
    // }
    // $scope.getRole();

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