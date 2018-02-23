var myApp = angular.module('myApp', ['ui.router', 'angular-loading-bar', 'ngAnimate', 'ngFlash', 'oitozero.ngSweetAlert'])
    .config(function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = true;
    })

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
                pageTitle: 'Verify User'
            },
            templateUrl: '../views/verify.html',
            controller: 'authController'
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

        // .state('verify', {
        //     url: '/verify',
        //     data: {
        //         pageTitle: 'Verify User'
        //     },
        //     templateUrl: '../views/verify.html',
        //     controller: 'portalController'
        // })

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
            url: '/case/:id',
            data: {
                pageTitle: 'Case'
            },
            templateUrl: '../views/case.html',
            controller: 'caseController'
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
    //     // $rootScope.title = current.$$route.title;
    //     // document.body.scrollTop = document.documentElement.scrollTop = 0;
    //     // $location.hash($routeParams.scrollTo);
    //     // $anchorScroll();
    // });
    $rootScope.$on('$stateChangeSuccess', function() {
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