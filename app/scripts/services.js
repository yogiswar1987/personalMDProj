angular.module('quickRideApp')
  .factory('AuthenticationService', ['$http', function ($http) {
    var phone;
    return {
      getPhone: function () {
        if (!phone) {
          phone = sessionStorage.getItem("phone");
        }
        return phone;
      },
      signUp: function (signUpData) {
        var urlOpts = {
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          url: BASE_URL + 'QRUser',
          transformRequest: function (obj) {
            var str = [];
            for (var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
          },
          data: signUpData
        };
        return $http(urlOpts).success(function (data) {
          sessionStorage.setItem("phone", signUpData.phone);
        });
      },
      checkReferralCode: function (referralCode) {
        var urlOpts = {
          method: 'GET',
          url: BASE_URL + 'QRUser/checkReferralCode?referralCode=' + referralCode
        };
        return $http(urlOpts);
      },
      login: function (user) {
        var urlOpts = {
          method: 'GET',
          url: BASE_URL + 'QRUser/login?userId=' + user.phone + '&pwd=' + user.pwd
        };
        return $http(urlOpts).success(function (data) {
          if (user.rememberme) {
            localStorage.setItem("phone", user.phone);
          }
          sessionStorage.setItem("phone", user.phone);
        }).error(function (data) {
          sessionStorage.setItem("phone", user.phone);
        });
      },
      resetPassword: function (user) {
        var urlOpts = {
          method: 'GET',
          url: BASE_URL + 'QRUser/password?phone=' + user.phone
        };
        return $http(urlOpts);
      },
      isSessionValid: function () {
        var phone = localStorage.getItem("phone") || sessionStorage.getItem("phone");
        if (phone) {
          sessionStorage.setItem("phone", phone);
        }
        return phone && phone != null ? true : false;
      },
      logout: function () {
        localStorage.removeItem("phone");
        sessionStorage.removeItem("phone");
      }
    }
  }]).factory('AccountService', ['$http', function ($http) {
  return {
    activateAccount: function (phone, activationCode) {
      var urlOpts = {
        method: 'GET',
        url: BASE_URL + 'QRUser/activateAccount?userId=' + phone + '&activationCode=' + activationCode
      };
      return $http(urlOpts);

    },
    changePassword: function (phone, oldPassword, newPassword) {
      var urlOpts = {
        method: 'PUT',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: BASE_URL + 'QRUser/password',
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        },
        data: {phone: phone, oldPassword: oldPassword, newPassword: newPassword}
      };
      return $http(urlOpts);

    },
    resendActivationCode: function (phone) {
      var urlOpts = {
        method: 'PUT',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: BASE_URL + 'QRUser/activationCode',
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        },
        data: {phone: phone}
      };
      return $http(urlOpts);
    }
  }
}]).factory('RideManagementService', ['$http', function ($http) {
  return {
    offerRide: function (userId, startAddress, startLatitude, startLongitude, endAddress, endLatitude, endLongitude, farePerKm, availableSeats, vehicleModel, startTime, route) {

      var month = '' + (startTime.getMonth() + 1);
      var day = '' + startTime.getDate();
      var year = '' + startTime.getFullYear();
      var hour = '' + startTime.getHours();
      var minutes = '' + startTime.getMinutes();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      if (hour.length < 2) hour = '0' + hour;
      if (minutes.length < 2) minutes = '0' + minutes;

      var requestData = {
        availableSeats: availableSeats,
        startAddress: startAddress,
        startLatitude: startLatitude,
        userId: userId,
        endLongitude: endLongitude,
        startLongitude: startLongitude,
        farePerKm: farePerKm,
        startTime: day + month + year + hour + minutes,
        endLatitude: endLatitude,
        endAddress: endAddress
      };
      var urlOpts = {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: BASE_URL + 'QRRiderRide',
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        },
        data: requestData
      };
      return $http(urlOpts);

    },
    requestRide: function (userId, startAddress, startLatitude, startLongitude, endAddress, endLatitude, endLongitude, startTime, route) {

      var month = '' + (startTime.getMonth() + 1);
      var day = '' + startTime.getDate();
      var year = '' + startTime.getFullYear();
      var hour = '' + startTime.getHours();
      var minutes = '' + startTime.getMinutes();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      if (hour.length < 2) hour = '0' + hour;
      if (minutes.length < 2) minutes = '0' + minutes;

      var requestData = {
        startAddress: startAddress,
        startLatitude: startLatitude,
        userId: userId,
        endLongitude: endLongitude,
        startLongitude: startLongitude,
        startTime: day + month + year + hour + minutes,
        endLatitude: endLatitude,
        endAddress: endAddress,
        noOfSeats: 1
      };
      var urlOpts = {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: BASE_URL + 'QRPassengerRide',
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        },
        data: requestData
      };
      return $http(urlOpts);

    },
    getPassengerRides: function (userId, startLatitude, startLongitude, startTime,endLatitude,endLongitude) {
      var month = '' + (startTime.getMonth() + 1);
      var day = '' + startTime.getDate();
      var year = '' + startTime.getFullYear();
      var hour = '' + startTime.getHours();
      var minutes = '' + startTime.getMinutes();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      if (hour.length < 2) hour = '0' + hour;
      if (minutes.length < 2) minutes = '0' + minutes;
      var url = 'startLongitude=' + startLongitude + '&startTime=' + day + month + year + hour + minutes + '&startLatitude=' + startLatitude + '&userId=8095054296';

      if(endLatitude && endLongitude){
        url = url+'&endLatitude ='+endLatitude+'&endLongitude='+endLongitude;
      }
      var urlOpts = {
        method: 'GET',
        url: BASE_URL + 'QRRidematcher/passengers/location?'+url
        };
      return $http(urlOpts);
    },
    getRiderRides: function (userId, startLatitude, startLongitude, startTime,endLatitude,endLongitude) {
      var month = '' + (startTime.getMonth() + 1);
      var day = '' + startTime.getDate();
      var year = '' + startTime.getFullYear();
      var hour = '' + startTime.getHours();
      var minutes = '' + startTime.getMinutes();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      if (hour.length < 2) hour = '0' + hour;
      if (minutes.length < 2) minutes = '0' + minutes;
      var url = 'startLongitude=' + startLongitude + '&startTime=' + day + month + year + hour + minutes + '&startLatitude=' + startLatitude + '&userId=8095054296';

      if(endLatitude && endLongitude){
        url = url+'&endLatitude ='+endLatitude+'&endLongitude='+endLongitude;
      }
      var urlOpts = {
        method: 'GET',
        url: BASE_URL + 'QRRidematcher/rides/location?'+url
      };
      return $http(urlOpts);
    },
    getAllRides:function(userId){
      var urlOpts = {
        method: 'GET',
        url: BASE_URL + 'QRRide/all?userId=' + userId
      };
      return $http(urlOpts);
    },
    cancelRiderRide:function(rideId,userId){
      var urlOpts = {
        method: 'DELETE',
        url: BASE_URL + 'QRRiderRide/status?userId=' + userId +'&id='+rideId
      };
      return $http(urlOpts);
    },
    cancelPassengerRide:function(rideId,userId){
      var urlOpts = {
        method: 'DELETE',
        url: BASE_URL + 'QRPassengerRide?id='+rideId+'&userId='+userId
      };
      return $http(urlOpts);
    }
  }
}]).factory('FeedbackService', ['$http', function ($http) {
    return {
      submitFeedback: function(){

      }
    }
}]).factory('ProfileService', ['$http', function ($http) {
  return {
    getVehicle: function (userId) {
      var urlOpts = {
        method: 'GET',
        url: BASE_URL + 'QRVehicle?ownerid=' + userId
      };
      return $http(urlOpts);
    },
    getProfileDetails: function (phone) {
      var urlOpts = {
        method: 'GET',
        url: BASE_URL + 'QRUser/completeProfile?userId=' + phone
      };
      return $http(urlOpts);
    },
    updateProfileDetail: function (profile) {
      var urlOpts = {
        method: 'PUT',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: BASE_URL + 'QRUserProfile/update',
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj)
            if (obj[p] !== undefined)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        },
        data: profile
      };
      return $http(urlOpts);
    },
    updateVehicleDetail: function (vehicle) {
      var urlOpts = {
        method: 'PUT',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: BASE_URL + 'QRVehicle/update',
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj)
            if (obj[p] !== undefined)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        },
        data: vehicle
      };
      return $http(urlOpts);
    },createVehicle: function (vehicle) {
      var urlOpts = {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: BASE_URL + 'QRVehicle',
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj)
            if (obj[p] !== undefined)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        },
        data: vehicle
      };
      return $http(urlOpts);
    },
    uploadImage: function (file) {
      return $http({
        method: 'POST',
        url: BASE_URL + 'QRImage',
        data: {photo: file},
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj)
            if (obj[p] !== undefined)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        },
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    }
  }
}]);
