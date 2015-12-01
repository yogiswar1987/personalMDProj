'use strict';


angular.module('quickRideApp', [
  'ui.router',
  'ngMaterial',
  'angular-carousel',
  'ngOpenFB'
])
  .run(function ($openFB) {
    $openFB.init({appId: '1524191344558710'});
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    window.BASE_URL = "http://testrm.getquickride.com:8080/dishaapiserver/rest/";
    $urlRouterProvider.otherwise('/landing');
    $stateProvider

      //Authentication Pages
      .state('auth', {
        abstract: true,
        url: "/auth",
        templateUrl: "views/auth.html"
      })
      .state('landing', {
        url: "/landing",
        templateUrl: "views/landing.html",
        controller: "LandingCtrl"
      })
      .state('auth.login', {
        url: "/login",
        templateUrl: "views/login.html",
        controller: "LoginCtrl"
      })
      .state('auth.signUp', {
        url: "/signUp",
        templateUrl: "views/signUp.html",
        controller: "SignUpCtrl"
      })
      .state('auth.forgotPassword', {
        url: "/forgotPassword",
        templateUrl: "views/forgotPassword.html",
        controller: "ForgotPasswordCtrl"
      })
      .state('auth.accountActivation', {
        url: "/accountActivation",
        templateUrl: "views/accountActivation.html",
        controller: "AccountActivationCtrl"
      })
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })

      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'views/search.html'
          }
        }
      })

      .state('app.browse', {
        url: '/browse',
        views: {
          'menuContent': {
            templateUrl: 'views/browse.html'
          }
        }
      })
      .state('app.playlists', {
        url: '/playlists',
        views: {
          'menuContent': {
            templateUrl: 'views/playlists.html',
            controller: 'PlaylistsCtrl'
          }
        }
      })
      .state('app.changePassword', {
        url: '/changePassword',
        views: {
          'menuContent': {
            templateUrl: 'views/changePassword.html',
            controller: 'ChangePasswordCtrl'
          }
        }
      })
      .state('app.single', {
        url: '/playlists/:playlistId',
        views: {
          'menuContent': {
            templateUrl: 'views/playlist.html',
            controller: 'PlaylistCtrl'
          }
        }
      });
  })




