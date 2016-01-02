'use strict';


angular.module('quickRideApp', [
    'ui.router',
    'ngMaterial',
    'ngMdIcons',
    'ngMessages',
    'angular-carousel',
    'ngOpenFB',
    'scDateTime'
  ])
  .run(function ($openFB) {
    $openFB.init({appId: '1524191344558710'});
  })

  .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider,$httpProvider) {
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];

    window.BASE_URL = "http://testrm.getquickride.com:8080/dishaapiserver/rest/";
    $mdThemingProvider.theme('default')
      .primaryPalette('green')
      .accentPalette('amber');

    $httpProvider.interceptors.push('EPHttpInterceptors');
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
      .state('app.transactions', {
        url: '/transactions',
        templateUrl: 'views/transactions.html',
        controller: 'TransactionsCtrl'
      })
      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'views/search.html'
          }
        }
      })
      .state('app.profile', {
        url: "/profile",
        templateUrl: "views/profile.html",
        controller: "ProfileCtrl"
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
        templateUrl: 'views/playlists.html',
        controller: 'PlaylistsCtrl'
      })
      .state('app.changePassword', {
        url: '/changePassword',
        templateUrl: 'views/changePassword.html',
        controller: 'ChangePasswordCtrl'
      }).state('app.newRide', {
        url: '/newRide',
        templateUrl: 'views/newRide.html',
        controller: 'NewRideCtrl'
      })
      .state('app.ride', {
        url: '/ride',
        templateUrl: 'views/ride.html',
        controller: 'RideCtrl'
      })
      .state('app.ride.offerRide', {
        url: '/offerRide',
        templateUrl: 'views/offerRide.html',
        controller: 'OfferRideCtrl'
      })
      .state('app.ride.findRide', {
        url: '/findRide',
        templateUrl: 'views/findRide.html',
        controller: 'FindRideCtrl'
      })
      .state('app.myRides', {
        url: '/myRides',
        templateUrl: 'views/myRides.html',
        controller: 'MyRidesCtrl'
      })
      .state('app.single', {
        url: '/playlists/:playlistId',
        templateUrl: 'views/playlist.html',
        controller: 'PlaylistCtrl'
      })
      .state('app.feedback', {
        url: '/feedback',
        templateUrl: 'views/feedback.html',
        controller: 'FeedbackCtrl'
      })
      .state('app.rewards', {
        url: '/rewards',
        templateUrl: 'views/rewards.html',
        controller: 'RewardsCtrl'
      })
      .state('app.shareAndEarn', {
        url: '/shareAndEarn',
        templateUrl: 'views/shareAndEarn.html',
        controller: 'ShareAndEarnCtrl'
      });
  })


  .factory('EPHttpInterceptors',['$location','$q','$rootScope',function EPHttpInterceptors($location,$q,$rootScope){

    return {
      request:function(config){
        console.log("request");
        $rootScope.isLoading = true;
        return config;
      },
      response:function(response){
        console.log("response");
        $rootScope.isLoading = false;
        return response;
      },
      responseError:function(resp){
        $rootScope.isLoading = false;
        return $q.reject(resp);
      }

    };
  }])
