var myApp = angular.module('myApp', ['ui.router', 'ui.bootstrap', 'ngSanitize', 'angular-loading-bar', 'ngAnimate', 'ngFlash'])
    .config(function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = true;
    })
    // oitozero.ngSweetAlert
myApp.filter('removeHTMLTags', function () {
    return function (text) {
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
});

// app.factory('socket', ['$rootScope', function ($rootScope) {
//     var socket = io.connect('http://localhost:3005/api');
//     window.socket = io.connect('http://localhost:3005/api');
//     return {
//         on: function (eventName, callback) {
//             socket.on(eventName, callback);
//         },
//         emit: function (eventName, data) {
//             socket.emit(eventName, data);
//         }
//     };
// }]);

myApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

myApp.directive('schrollBottom', function () {
    return {
        scope: {
            schrollBottom: "="
        },
        link: function (scope, element) {
            scope.$watchCollection('schrollBottom', function (newValue) {
                if (newValue) {
                    // var id = newValue.slice(-1)[0]._id;
                    // setTimeout(() => {
                    //     document.getElementById(id).scrollIntoView();
                    // }, 0);
                    setTimeout(() => {
                        var newHeight = $(element)[0].scrollHeight + 50;
                        // console.log(newHeight);
                        $(element).scrollTop(newHeight);
                    }, 0);
                }
            });
        }
    }
})



// myapp.config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
//     usSpinnerConfigProvider.setDefaults({color: 'blue'});
// }]);

myApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'FlashProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, FlashProvider) {
    // $locationProvider.hashPrefix('');
    //     usSpinnerConfigProvider.setTheme('bigBlue', {color: 'green', radius: 20});
    //     usSpinnerConfigProvider.setTheme('smallRed', {color: 'red', radius: 6});
    //     FlashProvider.setTemplate(`
    //     <div class="my-flash">{{ flash.text }}</div>
    // `);

    $locationProvider.html5Mode(true);
    $stateProvider

        //route for the homepage
        .state('index', {
            url: '/',
            data: {
                pageTitle: 'Welcometo MATTA DOR'
            },
            templateUrl: '../views/index.html',
            controller: ''
        })

        .state('register', {
            url: '/register',
            data: {
                pageTitle: 'Register'
            },
            templateUrl: '../views/register.html',
            controller: 'authController'
        })

        .state('login', {
            url: '/login',
            data: {
                pageTitle: 'Login'
            },
            templateUrl: '../views/login.html',
            controller: 'authController'
        })

        .state('forgotpassword', {
            url: '/forgot-password',
            data: {
                pageTitle: 'Forgot Password'
            },
            templateUrl: '../views/forgot-password.html',
            controller: 'authController'
        })

        .state('resetpassword', {
            url: '/reset-password/:id',
            data: {
                pageTitle: 'Reset Password'
            },
            templateUrl: '../views/reset-password.html',
            controller: 'authController'
        })

        .state('verify', {
            url: '/verify/:id',
            data: {
                pageTitle: 'Verify User'
            },
            templateUrl: '../views/verify.html',
            controller: 'authController'
        })

        //route for new blog post
        .state('portal', {
            url: '/portal',
            data: {
                pageTitle: 'ODR Portal'
            },
            templateUrl: '../views/portal.html',
            controller: 'portalController'
        })

        .state('profile', {
            url: '/profile',
            data: {
                pageTitle: 'Mediator Profile'
            },
            templateUrl: '../views/profile.html',
            controller: 'profileController'
        })

        .state('openfile', {
            url: '/open-file',
            data: {
                pageTitle: 'Open file'
            },
            templateUrl: '../views/open-file.html',
            controller: 'portalController'
        })

        //route for new blog post
        .state('newcomplaint', {
            url: '/new-complaint',
            data: {
                pageTitle: 'New Complaint'
            },
            templateUrl: '../views/new-complaint.html',
            controller: 'portalController'
        })

        .state('case', {
            url: '/case/:id?ref',
            data: {
                pageTitle: 'Case'
            },
            templateUrl: '../views/case.html',
            controller: 'caseController'
        })

        .state('pending', {
            url: '/pending',
            data: {
                pageTitle: 'Analysing Case'
            },
            templateUrl: '../views/pending.html',
            controller: 'portalController'
        })

        .state('admin', {
            url: '/admin',
            data: {
                pageTitle: 'Admin Dashboard'
            },
            templateUrl: '../views/admin/data.html',
            controller: 'adminController'
        })

        .state('admincase', {
            url: '/admin/complaints',
            data: {
                pageTitle: 'Complaints'
            },
            templateUrl: '../views/admin/complaints.html',
            controller: 'adminController'
        })

        .state('mediators', {
            url: '/admin/mediators',
            data: {
                pageTitle: 'Mediators'
            },
            templateUrl: '../views/admin/mediators.html',
            controller: 'adminController'
        })

        .state('tips', {
            url: '/legal-tips',
            data: {
                pageTitle: 'Legal Tips'
            },
            templateUrl: '../views/legal-tips.html',
            controller: 'authController'
        })

        .state('validate', {
            url: '/validate',
            data: {
                pageTitle: 'Validate User'
            },
            templateUrl: '../views/validate.html',
            controller: 'authController'
        })

        .state('mediatorProfile', {
            url: '/mediator-profile',
            data: {
                pageTitle: 'Update Mediator Profile'
            },
            templateUrl: '../views/mediator-profile.html',
            controller: 'profileController'
        })


        .state('files', {
            url: '/admin/files',
            data: {
                pageTitle: 'All Opened Files'
            },
            templateUrl: '../views/admin/files.html',
            controller: 'adminController'
        })
        .state('error', {
            url: '/error',
            data: {
                pageTitle: 'Error'
            },
            templateUrl: '../views/error.html',
            controller: 'authController'
        })

    $urlRouterProvider
        .otherwise('/');
}])

myApp.run(['$rootScope', '$location', '$anchorScroll', function ($rootScope, $location, $anchorScroll) {
    // $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
    //     $rootScope.title = current.$$route.title;
    // });
    $rootScope.$on('$stateChangeSuccess', function () {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
}]);

myApp.directive('updateTitle', ['$rootScope', '$timeout',
    function ($rootScope, $timeout) {
        return {
            link: function (scope, element) {
                var listener = function (event, toState) {
                    var title = 'Default Title';
                    if (toState.data && toState.data.pageTitle) title = toState.data.pageTitle;
                    $timeout(function () {
                        element.text(title);
                    }, 0, false);
                };
                $rootScope.$on('$stateChangeSuccess', listener);
            }
        };
    }
]);
