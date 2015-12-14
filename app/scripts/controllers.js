angular.module('quickRideApp')

  .controller('HomeCtrl', ['$rootScope', '$scope', '$timeout', '$location', 'AuthenticationService', '$mdSidenav',
    function ($rootScope, $scope, $timeout, $location, authenticationService, $mdSidenav) {
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
      $scope.toggleSidenav = function (menuId) {
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

  .controller('SignUpCtrl', ['$rootScope', '$scope', 'AuthenticationService', '$location', '$mdDialog', function ($rootScope, $scope, authenticationService, $location, $mdDialog) {

    $rootScope.showNavBar = true;
    $scope.male = true;
    $scope.signUpData = {};
    $scope.signUpData.gender = 'M';


    $scope.showPopup = function () {
      $mdDialog.show({
        clickOutsideToClose: true,
        scope: $scope,
        preserveScope: true,
        templateUrl: 'views/promoCode.html',
        controller: function DialogController($scope, $mdDialog) {
          $scope.closeDialog = function () {
            $mdDialog.hide();
          }
        }
      });
    };

    $scope.signUp = function (signUpForm) {
      if (signUpForm.$valid) {
        authenticationService.signUp($scope.signUpData).success(function (data) {
          $location.path('auth/accountActivation');
          console.log(data);
        }).error(function (error) {
          console.log(error);
          $mdDialog.show({
            clickOutsideToClose: true,
            scope: $scope,
            preserveScope: true,
            templateUrl: 'views/signUpError.html',
            controller: function DialogController($scope, $mdDialog) {
              $scope.errorMessage = error.resultData.userMsg;
              $scope.closeDialog = function () {
                $mdDialog.hide();
              }

              $scope.goToLogin = function(){
                $mdDialog.hide();
                $location.path('auth/login');
              }
            }
          });
        });
      }
    }
  }])
  .controller('PlaylistCtrl', function ($scope, $stateParams) {
  }).controller('LandingCtrl', ['$scope', '$timeout', '$openFB', 'AuthenticationService', '$location', '$rootScope', function ($scope, $timeout, $openFB, authenticationService, $location, $rootScope) {
  $scope.slides = [{
    url: 'images/splash_img1.png',
    text: 'One app for ride share,carpool and taxi share for daily commuting'
  }, {
    url: 'images/splash_img2.png',
    text: 'Ride now or later from any location'
  },
    {
      url: 'images/splash_img3.png',
      text: 'View matching riders going same route and join them instantly'
    },
    {
      url: 'images/splash_img4.png',
      text: 'Check detailed profile, when the person is unknown'
    }, {
      url: 'images/splash_img5.png',
      text: 'Track the location of co riders live on map and coordinate with group chat'
    },
    {
      url: 'images/splash_img6.png',
      text: 'Pay cash less with Quickride points'
    }, {
      url: 'images/splash_img7.png',
      text: 'Redeem the points to get free fuel'
    }];


  if (authenticationService.isSessionValid()) {
    $location.url('app/newRide');
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

}]).controller('LoginCtrl', ['$scope', '$location', 'AuthenticationService', '$mdDialog', function ($scope, $location, AuthenticationService, $mdDialog) {
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
          $mdDialog.show({
            clickOutsideToClose: true,
            scope: $scope,
            preserveScope: true,
            templateUrl: 'views/loginError.html',
            controller: function DialogController($scope, $mdDialog) {
              $scope.closeDialog = function () {
                $mdDialog.hide();
              }
            }
          });
        }
        console.log(error);
      });
    }
  }
}]).controller('ProfileCtrl', ['$scope', 'ProfileService', 'AuthenticationService', '$q', function ($scope, profileService, authenticationService, $q) {
    $scope.profile = {};
    $scope.vehicle = {};
    profileService.getProfileDetails(authenticationService.getPhone()).success(function (data) {
      var response = data.resultData;
      $scope.profile.id = response.userProfile.id;
      $scope.profile.confirmtype = response.userProfile.confirmtype;
      $scope.profile.userName = response.userProfile.userName;
      $scope.profile.companyname = response.userProfile.companyname;
      $scope.profile.profession = response.userProfile.profession;
      $scope.profile.aboutme = response.userProfile.aboutme;
      $scope.profile.imageURI = response.userProfile.imageURI ? response.userProfile.imageURI : '/images/default_male.png';
      $scope.profile.officeemail = response.userProfile.officeemail;
      $scope.profile.facebook = response.userProfile.facebook;
      $scope.profile.twitter = response.userProfile.twitter;
      $scope.profile.linkedin = response.userProfile.linkedin;
      $scope.profile.matchCompanyConstraint = response.userProfile.matchCompanyConstraint;
      $scope.profile.matchGenderConstraint = response.userProfile.matchGenderConstraint;
      $scope.profile.emergencyContactNumber = response.userProfile.emergencyContactNumber;

      $scope.vehicle.model = response.vehicle.model;
      $scope.vehicle.regno = response.vehicle.regno;
      $scope.vehicle.capacity = response.vehicle.capacity;
      $scope.vehicle.ownerid = response.userProfile.id;
      $scope.vehicle.fare = response.vehicle.fare;
      $scope.vehicle.imageURI = response.vehicle.imageURI ? response.vehicle.imageURI : '/images/suv.png';

    }).error(function (error) {
      console.log(error);
    });
    $scope.UploadProfileImage = function (files) {
      var file = files[0];
      var fr = new FileReader();
      console.log('hello world');
      fr.readAsDataURL(file);

      fr.onload = (function (theFile) {
        return function (e) {
          console.log(e.target.result);
          profileService.uploadImage(e.target.result.split('base64,')[1]).success(function (data) {
            $scope.profile.imageURI = data;
          }).error(function (data) {
            console.log(data);
          });
        };
      })(file);
    };
    $scope.UploadVehicleImage = function (files) {
      var file = files[0];
      var fr = new FileReader();
      console.log('hello world');
      fr.readAsDataURL(file);

      fr.onload = (function (theFile) {
        return function (e) {
          console.log(e.target.result);
          profileService.uploadImage(e.target.result.split('base64,')[1]).success(function (data) {
            $scope.profile.imageURI = data;
          }).error(function (data) {
            console.log(data);
          });
        };
      })(file);
    };
    $scope.updateProfile = function () {
      var updateProfilePromise = profileService.updateProfileDetail($scope.profile);
      var updateVehiclePromise = profileService.updateVehicleDetail($scope.vehicle);
      $q.all([updateProfilePromise, updateVehiclePromise]).then(function (data) {
        console.log(data);
      }, function (data) {
        console.log(data)
      })
    };
  }])
  .controller('AccountActivationCtrl', ['$scope', 'AccountService', 'AuthenticationService', '$location', function ($scope, accountService, authenticationService, $location) {
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
  }]).controller('ForgotPasswordCtrl', ['$scope', '$location', 'AuthenticationService', '$mdDialog', function ($scope, $location, authenticationService, $mdDialog) {
  $scope.user = {};
  $scope.resetPassword = function (forgotPasswordForm) {
    if (forgotPasswordForm.$valid) {
      authenticationService.resetPassword($scope.user).success(function (data) {
        $mdDialog.show({
          clickOutsideToClose: true,
          scope: $scope,
          preserveScope: true,
          templateUrl: 'views/forgotPasswordConfirm.html',
          controller: function DialogController($scope, $mdDialog) {
            $scope.closeDialog = function () {
              $mdDialog.hide();
            }
          }
        });

      }).error(function (error) {
        /*var alertPopup = $ionicPopup.alert({
         template: error.resultData.userMsg,
         okType: 'button-balanced'
         });
         alertPopup.then(function (res) {

         });

         console.log(error);*/
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
}]).controller('NewRideCtrl', ['$scope','$timeout', function ($scope,$timeout) {
    var myLatlng = new google.maps.LatLng(12.9715987, 77.5945627);

    var mapOptions = {
      center: myLatlng,
      zoom: 12,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById("map"),
      mapOptions);
    navigator.geolocation.getCurrentPosition(function (pos) {
      var myLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      $scope.map.setCenter(myLatLng);
      $scope.map.setZoom(16);
      var circle = new google.maps.Circle({
        center: myLatLng,
        radius: pos.coords.accuracy,
        map: $scope.map,
        fillColor: '#ABD8E6',
        fillOpacity: 0.5,
        strokeColor: '#ABD8E6',
        strokeOpacity: 1.0
      });
      var circle1 = new google.maps.Circle({
        center: myLatLng,
        radius: 1,
        map: $scope.map,
        fillColor: '#00BDFE',
        fillOpacity: 1.0,
        strokeColor: '#00BDFE',
        strokeOpacity: 1.0
      });
      var icon = {
        url: "/images/icon_marker.png", // url
        scaledSize: new google.maps.Size(50, 50), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(25, 45) // anchor
      };
      var marker = new google.maps.Marker({
        position: myLatLng,
        draggable: true,
        animation: google.maps.Animation.DROP,
        map: $scope.map,
        icon:icon
      });

      google.maps.event.addListener(marker, 'dragend', function () {
        geocodePosition(marker.getPosition());
      });
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
    function geocodePosition(pos) {
      geocoder = new google.maps.Geocoder();
      geocoder.geocode
      ({
          latLng: pos
        },
        function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            console.log(results[0].formatted_address);
          }
          else {
            console.log('Cannot determine address at this location.' + status);
          }
        }
      );
    }
  $timeout(function(){
    google.maps.event.trigger($scope.map, 'resize');
  })
  }])
  .controller('RideCtrl', ['$scope', function ($scope) {
    /*   var myLatlng = new google.maps.LatLng(12.9715987, 77.5945627);

     var mapOptions = {
     center: myLatlng,
     zoom: 12,
     disableDefaultUI: true,
     mapTypeId: google.maps.MapTypeId.ROADMAP
     };
     $scope.map = new google.maps.Map(document.getElementById("map"),
     mapOptions);
     navigator.geolocation.getCurrentPosition(function (pos) {
     var myLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
     $scope.map.setCenter(myLatLng);
     $scope.map.setZoom(16);
     var circle = new google.maps.Circle({
     center: myLatLng,
     radius: pos.coords.accuracy,
     map: $scope.map,
     fillColor: '#ABD8E6',
     fillOpacity: 0.5,
     strokeColor: '#ABD8E6',
     strokeOpacity: 1.0
     });
     var circle1 = new google.maps.Circle({
     center: myLatLng,
     radius: 1,
     map: $scope.map,
     fillColor: '#00BDFE',
     fillOpacity: 1.0,
     strokeColor: '#00BDFE',
     strokeOpacity: 1.0
     });
     var marker = new google.maps.Marker({
     position: myLatLng,
     draggable: true,
     animation: google.maps.Animation.DROP,
     map: $scope.map,
     title: 'Hello World!'
     });

     google.maps.event.addListener(marker, 'dragend', function () {
     geocodePosition(marker.getPosition());
     });
     }, function (error) {
     alert('Unable to get location: ' + error.message);
     });
     function geocodePosition(pos) {
     geocoder = new google.maps.Geocoder();
     geocoder.geocode
     ({
     latLng: pos
     },
     function (results, status) {
     if (status == google.maps.GeocoderStatus.OK) {
     console.log(results[0].formatted_address);
     }
     else {
     console.log('Cannot determine address at this location.' + status);
     }
     }
     );
     }*/
  }]).controller('OfferRideCtrl', ['$scope', 'RideManagementService', 'AuthenticationService', 'ProfileService', function ($scope, rideManagementService, authenticationService, profileService) {
  profileService.getVehicle(authenticationService.getPhone()).success(function (data) {
    $scope.vehicle = data.resultData;
  }).error(function (data) {
    console.log(data);
  });
  $scope.$parent.selectedIndex = -1;
  $scope.selectedIndex = -1;
  $scope.flip = function ($index) {
    if ($index !== $scope.selectedIndex) {
      $scope.$parent.selectedIndex = $index;
      $scope.selectedIndex = $index;
    }
    else {
      $scope.selectedIndex = -1;
      $scope.$parent.selectedIndex = -1;
    }
  };
  $scope.from = new google.maps.places.Autocomplete(document.getElementById('from'));
  $scope.riderRides = [{
    "userid": 9739001010,
    "rideid": 131,
    "name": "qwer",
    "userRole": "Passenger",
    "gender": "M",
    "rating": 0.0,
    "startDate": 1449976680000,
    "fromLocationAddress": "Marathahalli, Bengaluru, Karnataka, India",
    "fromLocationLatitude": 12.9591722,
    "fromLocationLongitude": 77.69741899999997,
    "toLocationAddress": "Majestic, Bengaluru, Karnataka, India",
    "toLocationLatitude": 12.9766637,
    "toLocationLongitude": 77.57125559999997,
    "pickupLocationLatitude": 12.95879,
    "pickupLocationLongitude": 77.69748,
    "pickupTime": 1449979260000,
    "dropLocationLatitude": 12.9766637,
    "dropLocationLongitude": 77.57125559999997,
    "dropTime": 1449982860000,
    "distance": 15.418,
    "points": 77,
    "matchPercentage": 100,
    "noOfReviews": 0,
    "verificationStatus": false,
    "requiredSeats": 1
  }, {
    "userid": 9739001010,
    "rideid": 131,
    "name": "qwer",
    "userRole": "Passenger",
    "gender": "M",
    "rating": 0.0,
    "startDate": 1449976680000,
    "fromLocationAddress": "Marathahalli, Bengaluru, Karnataka, India",
    "fromLocationLatitude": 12.9591722,
    "fromLocationLongitude": 77.69741899999997,
    "toLocationAddress": "Majestic, Bengaluru, Karnataka, India",
    "toLocationLatitude": 12.9766637,
    "toLocationLongitude": 77.57125559999997,
    "pickupLocationLatitude": 12.95879,
    "pickupLocationLongitude": 77.69748,
    "pickupTime": 1449979260000,
    "dropLocationLatitude": 12.9766637,
    "dropLocationLongitude": 77.57125559999997,
    "dropTime": 1449982860000,
    "distance": 15.418,
    "points": 77,
    "matchPercentage": 100,
    "noOfReviews": 0,
    "verificationStatus": false,
    "requiredSeats": 1
  }];
  google.maps.event.addListener($scope.from, 'place_changed', function () {
    var place = $scope.from.getPlace();
    place.formatted_address;
    place.geometry.location.lat();
    place.geometry.location.lng();
    rideManagementService.getPassengerRides(authenticationService.getPhone(), place.geometry.location.lat(), place.geometry.location.lng(), new Date()).success(function (data) {
      $scope.riderRides = data.resultData;
    }).error(function (data) {
      console.log(data);
    });
  });
  $scope.to = new google.maps.places.Autocomplete(document.getElementById('to'));
  google.maps.event.addListener($scope.to, 'place_changed', function () {
    var place = $scope.to.getPlace();
    place.formatted_address;
    place.geometry.location.lat();
    place.geometry.location.lng();
  });

  $scope.offerRide = function () {
    if ($scope.from.getPlace().geometry && $scope.to.getPlace().geometry) {
      rideManagementService.offerRide(authenticationService.getPhone(), $scope.from.getPlace().formatted_address, $scope.from.getPlace().geometry.location.lat(), $scope.from.getPlace().geometry.location.lng(), $scope.to.getPlace().formatted_address, $scope.to.getPlace().geometry.location.lat(), $scope.to.getPlace().geometry.location.lng(), $scope.vehicle.fare, $scope.vehicle.capacity, $scope.vehicle.model, new Date()).success(function (data) {
        console.log(data);
      }).error(function (data) {
        console.log(data);
      });
    }
  };
}]).controller('FindRideCtrl', ['$scope', 'RideManagementService', 'AuthenticationService', function ($scope, rideManagementService, authenticationService) {
  $scope.from = new google.maps.places.Autocomplete(document.getElementById('from'));
  google.maps.event.addListener($scope.from, 'place_changed', function () {
    var place = $scope.from.getPlace();
    place.formatted_address;
    place.geometry.location.lat();
    place.geometry.location.lng();
    rideManagementService.getRiderRides(authenticationService.getPhone(), place.geometry.location.lat(), place.geometry.location.lng(), new Date()).success(function (data) {
      console.log(data);
    }).error(function (data) {
      console.log(data);
    })
  });
  $scope.to = new google.maps.places.Autocomplete(document.getElementById('to'));
  google.maps.event.addListener($scope.to, 'place_changed', function () {
    var place = $scope.to.getPlace();
    place.formatted_address;
    place.geometry.location.lat();
    place.geometry.location.lng();
  });

  $scope.requestRide = function () {
    if ($scope.from.getPlace().geometry && $scope.to.getPlace().geometry) {
      rideManagementService.requestRide(authenticationService.getPhone(), $scope.from.getPlace().formatted_address, $scope.from.getPlace().geometry.location.lat(), $scope.from.getPlace().geometry.location.lng(), $scope.to.getPlace().formatted_address, $scope.to.getPlace().geometry.location.lat(), $scope.to.getPlace().geometry.location.lng(), new Date()).success(function (data) {
        console.log(data);
      }).error(function (data) {
        console.log(data);
      });
    }
  };
}]);


