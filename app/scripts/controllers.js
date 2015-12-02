angular.module('quickRideApp')

  .controller('HomeCtrl', ['$rootScope', '$scope', '$timeout', '$location', 'AuthenticationService','$mdSidenav',
    function ($rootScope, $scope, $timeout, $location, authenticationService,$mdSidenav) {
      $scope.menu = [
        {
          link: '',
          title: 'Dashboard',
          icon: 'dashboard'
        },
        {
          link: '',
          title: 'Friends',
          icon: 'group'
        },
        {
          link: '',
          title: 'Messages',
          icon: 'message'
        }
      ];
      $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
      };
      $rootScope.showNavBar = false;
      $scope.logout = function () {
        authenticationService.logout();
        $location.path('#/auth/landing');
      };

    }])
  .controller('PlaylistsCtrl', function ($scope) {
    $scope.playlists = [
      {title: 'Reggae', id: 1},
      {title: 'Chill', id: 2},
      {title: 'Dubstep', id: 3},
      {title: 'Indie', id: 4},
      {title: 'Rap', id: 5},
      {title: 'Cowbell', id: 6}
    ];
  })

  .controller('SignUpCtrl', ['$rootScope', '$scope', 'AuthenticationService', '$location', function ($rootScope, $scope, authenticationService, $location) {

    $rootScope.showNavBar = true;
    $scope.male = true;
    $scope.signUpData = {};
    $scope.signUpData.gender = 'M';
    // Triggered on a button click, or some other target
    $scope.showPopup = function () {
      $scope.data = {}

      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="signUpData.promocode">',
        title: 'Apply your promo code',
        scope: $scope,
        buttons: [
          {
            text: '<b>Apply</b>',
            type: 'button-balanced',
            onTap: function (e) {
              if (!$scope.signUpData.promocode) {
                e.preventDefault();
              } else {
                authenticationService.checkReferralCode($scope.signUpData.promoode).success(function (data) {
                  var alertPopup = $ionicPopup.alert({
                    template: data,
                    buttons: [
                      {
                        text: '<b>Ok</b>',
                        type: 'button-balanced'
                      }]
                  });
                  alertPopup.then(function (res) {
                    console.log('promo code alert closed');
                  });
                }).error(function (error) {
                  var alertPopup = $ionicPopup.alert({
                    template: error.resultData.userMsg,
                    buttons: [
                      {
                        text: '<b>Ok</b>',
                        type: 'button-balanced'
                      }]
                  });
                  alertPopup.then(function (res) {
                    console.log(error);
                  });
                });
              }
            }
          },
          {text: 'Cancel'}
        ]
      });
      myPopup.then(function (res) {
        console.log('Tapped!', res);
      });
    };

    $scope.signUp = function (signUpForm) {
      if (signUpForm.$valid) {
        authenticationService.signUp($scope.signUpData).success(function (data) {
          $location.path('auth/accountActivation');
          console.log(data);
        }).error(function (error) {
          console.log(error);
        });
      }
    }
  }])
  .controller('PlaylistCtrl', function ($scope, $stateParams) {
  }).controller('LandingCtrl', ['$scope', '$timeout', '$openFB', 'AuthenticationService', '$location', '$rootScope', function ($scope, $timeout, $openFB, authenticationService, $location, $rootScope) {
    $scope.carouselImages = [{
      url: 'images/splash_img1.png',
      text: 'display text'
    }, {url: 'images/splash_img2.png'}, {url: 'images/splash_img3.png'}, {url: 'images/splash_img4.png'}, {url: 'images/splash_img5.png'}, {url: 'images/splash_img6.png'}, {url: 'images/splash_img7.png'}];
    if (authenticationService.isSessionValid()) {
      $location.url('app/browse');
    }

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      var p = $location.path();
      if (p.indexOf('auth') == -1 && !authenticationService.isSessionValid()) {
        $location.path('#/auth/login');
        $location.replace();
      }
    });


    $scope.fbLogin = function () {
      $openFB.login({scope: 'email'}).then(
        function (response) {
          if (response.status === 'connected') {
            $openFB.api({
              path: '/me',
              params: {fields: 'id,name,email,gender,link,middle_name,first_name,last_name,cover,picture'}
            }).then(
              function (user) {
                $scope.user = user;
              },
              function (error) {
                alert('Facebook error: ' + error.error_description);
              });
            $openFB.api({
              path: '/me/picture',
              params: {
                type: 'normal'
              }
            }).then(
              function (user) {
                $scope.picture = user;
              },
              function (error) {
                alert('Facebook error: ' + error.error_description);
              });
            ;
            console.log('Facebook login succeeded');
          } else {
            alert('Facebook login failed');
          }
        });
    };

  }]).controller('LoginCtrl', ['$scope', '$location', 'AuthenticationService', function ($scope, $location, AuthenticationService) {
    $scope.user = {};
    $scope.login = function (loginForm) {
      if (loginForm.$valid) {
        AuthenticationService.login($scope.user).success(function (data) {
          console.log(data);
          $location.path("/app/browse");
        }).error(function (error) {
          if (error.errorCode === 1007) {
            $location.path('auth/accountActivation')
          } else {
            var alertPopup = $ionicPopup.alert({
              template: error.resultData.userMsg,
              okType: 'button-balanced'
            });
            alertPopup.then(function (res) {

            });
          }
          console.log(error);
        });
      }
    }
  }]).controller('AccountActivationCtrl', ['$scope', 'AccountService', 'AuthenticationService', '$location', function ($scope, accountService, authenticationService, $location) {
    if (!authenticationService.getPhone()) {
      $location.path('/auth/login');
    } else {
      $scope.activationData = {};
      $scope.activateAccount = function (accountActivationForm) {
        if (accountActivationForm.$valid) {
          accountService.activateAccount(authenticationService.getPhone(), $scope.activationData.activationCode).success(function (data) {
            console.log(data);
            $location.path("/app/browse");
          }).error(function (error) {
            console.log(error);
          });
        }
      }
      $scope.resendActivationCode = function () {
        if (!authenticationService.getPhone()) {
          $location.path('/auth/login');
        }
        accountService.resendActivationCode(authenticationService.getPhone()).success(function (data) {
          console.log(data);
        }).error(function (error) {
          console.log(error);
        });
      }
    }
  }]).controller('ForgotPasswordCtrl', ['$scope', '$location', 'AuthenticationService', function ($scope, $location, authenticationService) {
    $scope.user = {};
    $scope.resetPassword = function (forgotPasswordForm) {
      if (forgotPasswordForm.$valid) {
        authenticationService.resetPassword($scope.user).success(function (data) {
          console.log(data);
          var alertPopup = $ionicPopup.alert({
            template: "New password for Quickride has sent to your registered mobile number",
            okType: 'button-balanced'
          });
          alertPopup.then(function (res) {
            $location.path("/auth/login");
          });

        }).error(function (error) {
          var alertPopup = $ionicPopup.alert({
            template: error.resultData.userMsg,
            okType: 'button-balanced'
          });
          alertPopup.then(function (res) {

          });

          console.log(error);
        });
      }
    };
  }]).controller('ChangePasswordCtrl', ['$scope', '$location', 'AccountService', 'AuthenticationService', function ($scope, $location, accountService, authenticationService) {
    $scope.user = {};
    $scope.changePassword = function (changePasswordForm) {
      if (changePasswordForm.$valid) {
        accountService.changePassword(authenticationService.getPhone(), $scope.user.old_pwd, $scope.user.new_pwd).success(function (data) {
          console.log(data);
          $scope.user.old_pwd = '';
          $scope.user.new_pwd = '';
        }).error(function (error) {
          console.log(error);
        });
      }
    };
  }]).directive('confirmPwd', ['$interpolate', '$parse', function ($interpolate, $parse) {
    return {
      require: 'ngModel',
      link: function (scope, elem, attr, ngModelCtrl) {

        var pwdToMatch = $parse(attr.confirmPwd);
        var pwdFn = $interpolate(attr.confirmPwd)(scope);

        scope.$watch(pwdFn, function (newVal) {
          ngModelCtrl.$setValidity('password', ngModelCtrl.$viewValue == newVal);
        })

        ngModelCtrl.$validators.password = function (modelValue, viewValue) {
          var value = modelValue || viewValue;
          return value == pwdToMatch(scope).$modelValue;
        };

      }
    }
  }]);
;

