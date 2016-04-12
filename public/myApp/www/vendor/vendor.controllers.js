angular
  .module('vendor')
    .controller('VendorLoginCtrl', function($scope, $q, $rootScope, $state, VendorService){
      $scope.loginVendor = function(login){
        console.log("LOGGING IN");
        VendorService.loginVendor(login).then(function(vendor){
          $state.go('tab.vendordashboard');
        });
      };
    })

    .controller('VendorsignupCtrl', function($scope, VendorService){
      $scope.signup = function(vendor){
        console.log("SIGN UP");
        VendorService.signup(vendor);
      };
    })


    .controller('VendordashboardCtrl', function($scope, $cordovaGeolocation, VendorService, $q){

      $scope.currentVendor = JSON.parse(localStorage.currentVendor);
      $scope.dropPin = function(post, vendorId){
        $cordovaGeolocation.getCurrentPosition().then(function(position){
          console.log("RELOG POS", position);
          var id = $scope.currentVendor.id;
          console.log("SHOW",post);
          post.lat = position.coords.latitude;
          post.lng = position.coords.longitude;
          VendorService.dropPin(post, id)
          .success(function(data) {
            console.log("YAY", data);
          })
          .error(function(err) {
            console.log('err', err);
          });
        });
      };
    })

    .controller('EditCtrl', function($scope){
      $scope.edit = function(vendor) {
        console.log(vendor);
        window.editVendor = vendor;
      };
    });