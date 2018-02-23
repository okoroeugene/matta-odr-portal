
// var myApp = angular.module('myApp', ['ui.router', 'angular-loading-bar', 'ngAnimate'])
//     .config(function (cfpLoadingBarProvider) {
//         cfpLoadingBarProvider.includeSpinner = true;
//     })

// // myApp.run(['$state', '$stateParams',
// //     function ($state, $stateParams) {
// //         //this solves page refresh and getting back to state
// //         $state.transitionTo($state.current, $stateParams, {
// //             reload: true,
// //             inherit: false,
// //             notify: true
// //         });
// //     }]);

// myApp.directive('fileModel', ['$parse', function ($parse) {
//     return {
//         restrict: 'A',
//         link: function (scope, element, attrs) {
//             var model = $parse(attrs.fileModel);
//             var modelSetter = model.assign;

//             element.bind('change', function () {
//                 scope.$apply(function () {
//                     modelSetter(scope, element[0].files[0]);
//                 });
//             });
//         }
//     };
// }]);

// myApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
//     // $locationProvider.hashPrefix('');
//     $locationProvider.html5Mode(true);
//     $stateProvider

//         //route for the homepage
//         .state('index', {
//             url: '/',
//             data: {
//                 pageTitle: 'Homepage'
//             },
//             templateUrl: '../views/index.html',
//             controller: 'mainController'
//         })

//         .state('blog', {
//             url: '/blog',
//             data: {
//                 pageTitle: 'Blog'
//             },
//             templateUrl: '../views/index.html',
//             controller: 'mainController'
//         })

//         //route for new blog post
//         .state('newpost', {
//             url: '/newpost',
//             data: {
//                 pageTitle: 'New Post'
//             },
//             templateUrl: '../views/newpost.html',
//             controller: 'newpostController'
//         })

//         .state(
//         'postdetails', {
//             url: '/post-details/:id',
//             data: {
//                 pageTitle: 'Post Details'
//             },
//             templateUrl: '../views/post-details.html',
//             controller: 'postController'
//         })

//         .state('edit-post', {
//             url: '/edit-post/:id',
//             data: {
//                 pageTitle: 'Edit Post'
//             },
//             templateUrl: '../views/edit-post.html',
//             controller: 'postController'
//         })

//     $urlRouterProvider
//         .otherwise('/');
// })

// myApp.run(['$rootScope', '$location', '$anchorScroll', function ($rootScope, $location, $anchorScroll) {
//     $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
//         // $rootScope.title = current.$$route.title;
//         // document.body.scrollTop = document.documentElement.scrollTop = 0;
//         // $location.hash($routeParams.scrollTo);
//         // $anchorScroll();
//     });
// }]);

// myApp.directive('updateTitle', ['$rootScope', '$timeout',
//     function ($rootScope, $timeout) {
//         return {
//             link: function (scope, element) {

//                 var listener = function (event, toState) {

//                     var title = 'Default Title';
//                     if (toState.data && toState.data.pageTitle) title = toState.data.pageTitle;

//                     $timeout(function () {
//                         element.text(title);
//                     }, 0, false);
//                 };

//                 $rootScope.$on('$stateChangeSuccess', listener);
//             }
//         };
//     }
// ]);

// myApp.controller('layoutController', ['$scope', '$timeout', '$http', '$window', 'cfpLoadingBar', function ($scope, $timeout, $http, $window, cfpLoadingBar) {
//     $scope.redirectToLogin = function () {
//         $window.location.href = '/login';
//     }

//     $scope.getUser = function () {
//         $scope.start();
//         $http.get('http://localhost:3001/user').then(function (response) {
//             // console.log(response.data);
//             if (response.data === 'null') $scope.page = 'login';
//             else {
//                 $scope.showUser = response.data;
//                 $scope.page = 'user';
//             }
//         })
//     }

//     $scope.logout = function () {
//         $window.location.href = '/logout';
//     }

//     $scope.start = function () {
//         cfpLoadingBar.start();
//     };
//     $scope.complete = function () {
//         cfpLoadingBar.complete();
//     }
//     // fake the initial load so first time users can see it right away:

//     // $scope.fakeIntro = true;
//     // $timeout(function () {
//     //     $scope.complete();
//     //     $scope.fakeIntro = false;
//     // }, 750);

//     $scope.getUser();
//     $scope.complete();

// }])

// myApp.controller('mainController', ['$scope', '$state', '$stateParams', '$http', '$timeout', 'cfpLoadingBar', '$location', '$anchorScroll', function ($scope, $state, $stateParams, $http, $timeout, cfpLoadingBar, $location, $anchorScroll) {
//     $scope.start = function () {
//         cfpLoadingBar.start();
//     };
//     $scope.complete = function () {
//         cfpLoadingBar.complete();
//     };
//     $scope.start();
//     // get all student from databse  
//     $scope.getLists = function () {
//         // var apiRoute = baseUrl;
//         $http.get('http://localhost:3001/getblogpost').then(function (response) {
//             $scope.allData = response.data;
//         }, function (error) {
//             console.log("Error: " + error);
//         });
//     }

//     $scope.deletePost = function (ID) {
//         $scope.start();
//         var data = {
//             'PostId': ID
//         };
//         setTimeout(function ($scope, $location, $anchorScroll) {
//             $http.post('http://localhost:3001/deletepost', data).then(function (response) {
//                 $state.transitionTo($state.current, $stateParams, {
//                     reload: true,
//                     inherit: false,
//                     notify: true
//                 });
//                 // $location.hash(response.data._id);
//                 // $anchorScroll();
//             });
//         }, 6000);
//     };

//     $scope.getLists();
//     $scope.complete();
// }]);


// myApp.controller('postController', ['$scope', '$state', '$stateParams', '$http', '$timeout', 'cfpLoadingBar', '$location', '$anchorScroll', function ($scope, $state, $stateParams, $http, $timeout, cfpLoadingBar, $location, $anchorScroll) {
//     var currentId = $stateParams.id;
//     $scope.start = function () {
//         cfpLoadingBar.start();
//     };
//     $scope.complete = function () {
//         cfpLoadingBar.complete();
//     }

//     // $scope.showDetails = function () {
//     //     $http.get('http://localhost:3001/post-details/' + currentId).then(function (response) {
//     //         $scope.postData = response.data;
//     //         console.log(response.data);
//     //     }, function (error) {
//     //         console.log("Error: " + error);
//     //     });

//     // };

//     $scope.showCount = function () {
//         $http.get('http://localhost:3001/getCount/' + currentId).then(function (response) {
//             $scope.commentCount = response.data;
//         }, function (error) {
//             console.log("Error: " + error);
//         });
//     };

//     $scope.getLists = function (data) {
//         // var apiRoute = baseUrl;
//         $http.get('http://localhost:3001/mypostdetails/' + currentId).then(function (response) {
//             $scope.postData = response.data;
//             // console.log(response.data);
//         }, function (error) {
//             console.log("Error: " + error);
//         });
//     }

//     $scope.showComments = function () {
//         $http.get('http://localhost:3001/showcomments/' + currentId).then(function (response) {
//             $scope.myComments = response.data;
//         });
//     };

//     $scope.createComment = function () {
//         $scope.start();
//         var data = {
//             'FullName': $scope.fullname,
//             'Email': $scope.email,
//             'Content': $scope.content,
//             'PostId': currentId
//         };

//         setTimeout(function ($scope, $location, $anchorScroll) {
//             $http.post('http://localhost:3001/comment', data).then(function (response) {
//                 $state.transitionTo($state.current, $stateParams, {
//                     reload: true,
//                     inherit: false,
//                     notify: true
//                 });
//                 $scope.complete();
//                 $location.hash(response.data._id);
//                 $anchorScroll();
//             });
//         }, 6000);

//     };

//     // $state.reload();

//     $scope.getLists();
//     $scope.showComments();
//     // $scope.showDetails();
//     $scope.showCount();
//     $scope.complete();
//     // $state.transitionTo("post-details", {
//     //     reload: true,
//     //     notify: true
//     // });
//     // $state.transitionTo($state.current, $stateParams, {
//     //     reload: true,
//     //     inherit: false,
//     //     notify: true
//     // });
// }]);

// myApp.controller('editController', ['$scope', '$http', '$timeout', 'cfpLoadingBar', '$stateParams', function ($scope, $http, $timeout, cfpLoadingBar, $stateParams) {
//     // get all student from databse  
//     var currentId = $stateParams.id;
//     // console.log(currentId);
//     $scope.getLists = function (data) {
//         // var apiRoute = baseUrl;
//         $http.get('http://localhost:3001/editpost/' + currentId).then(function (response) {
//             $scope.postData = response.data;
//             // console.log(response.data);
//         }, function (error) {
//             console.log("Error: " + error);
//         });
//     }

//     $scope.start = function () {
//         cfpLoadingBar.start();
//     };
//     $scope.complete = function () {
//         cfpLoadingBar.complete();
//     }
//     // fake the initial load so first time users can see it right away:
//     $scope.start();
//     $scope.fakeIntro = true;
//     $timeout(function () {
//         $scope.complete();
//         $scope.fakeIntro = false;
//     }, 750);

//     $scope.getLists();
// }]);

// myApp.controller('newpostController', ['$scope', '$state', '$stateParams', '$http', '$timeout', 'cfpLoadingBar', '$location', '$anchorScroll', function ($scope, $state, $stateParams, $http, $timeout, cfpLoadingBar, $location, $anchorScroll) {
//     $scope.start = function () {
//         cfpLoadingBar.start();
//     };

//     $scope.complete = function () {
//         cfpLoadingBar.complete();
//     }

//     $scope.createPost = function () {
//         $scope.start();
//         var data = {
//             'PostTitle': $scope.posttitle,
//             'file': $scope.Image.name,
//             'Content': $scope.content
//         };
//         setTimeout(($scope, $location, $anchorScroll, $stateParams) => {
//             $http.post('http://localhost:3001/newpost', data).then(function (response) {
//                 $state.transitionTo('postdetails', { id: response.data }, {
//                     reload: true,
//                     // inherit: false,
//                     notify: true
//                 });
//             });
//         }, 6000);
//     };
// }])