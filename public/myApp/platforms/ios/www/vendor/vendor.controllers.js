angular
  .module('vendor')
    .controller('VendorLoginCtrl', function($scope, $q, $state, VendorService){
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
        localStorage.currentVendor = JSON.stringify(vendor);
      };
    })


    .controller('VendordashboardCtrl', function($scope, $cordovaGeolocation, VendorService, $q){
      $scope.currentVendor = JSON.parse(localStorage.currentVendor);
      $scope.located = false;
      $scope.post = {};

      $scope.gotLocation = function() {
        return $scope.located;
      };

      $cordovaGeolocation.getCurrentPosition().then(function(position){
        $scope.located = true;
        $scope.lat = position.coords.latitude;
        $scope.lng = position.coords.longitude;
      }, function(err) {
        console.log(err);
      });


      console.log("LOOK AT THIS", $scope.currentVendor);

      $scope.dropPin = function(post, vendorId){
          // $scope.currentVendor = JSON.parse(localStorage.currentVendor);
          $scope.currentVendor.location = {};
          var id = $scope.currentVendor.id;

          post.lat = $scope.lat;
          post.lng = $scope.lng;
          console.log("SHOW",post);

          $scope.currentVendor.location.imageUrl = post.imageUrl;
          $scope.currentVendor.location.lat = post.lat;
          $scope.currentVendor.location.lng = post.lng;
          $scope.currentVendor.location.tweet = post.tweet;
          // $scope.currentVendor.location.time = post.created.hour%12 + ":" + post.created.minute;
          $scope.currentVendor.location.time = new Date().toLocaleTimeString().replace("/.*(\d{2}:\d{2}:\d{2}).*/", "$1");
          localStorage.setItem('currentVendor', JSON.stringify($scope.currentVendor));

          VendorService.dropPin(post, id)
            .then(function(response) {
              console.log("YAY", response.data);
            }, function(err) {
              console.log('err', err);
            });
      };

      $scope.logoutVendor = function() {
        VendorService.logoutVendor();
        $scope.$parent.toggleVendorView();
      };
    })

    .controller('VendordashdetailCtrl', function($scope, VendorService, $stateParams){
        $scope.currentVendor = JSON.parse(localStorage.getItem('currentVendor'));

        console.log("CURRENT VENDOR " + $scope.currentVendor);
          var mapOptions = {
            center: {lat: $scope.currentVendor.location.lat, lng: $scope.currentVendor.location.lng},
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          $scope.map = new google.maps.Map(document.getElementById("map-detail"), mapOptions);

          var marker = new google.maps.Marker({
            position: {lat: $scope.currentVendor.location.lat, lng: $scope.currentVendor.location.lng},
            map: $scope.map
          });

          marker.setMap($scope.map);
    })

    .controller('EditCtrl', function($scope, VendorService, $state){
      // Get current vendor from localStorage, clear tags for edit
      $scope.currentVendor = JSON.parse(localStorage.currentVendor);
      $scope.currentVendor.tags = [];

      // Declare edited vendor object, tags as an array
      $scope.editedVendor = {};
      $scope.editedVendor.tags = [];

      $scope.editVendor = function(editedVendor) {
        // Process tag checkboxes
        var tagArr = [];
        editedVendor.tags.forEach(function(tag, idx) {
          // If a tag is selected
          if (tag) {
            // Process for back-end
            tagArr.push(
              {
                id: idx,
                tag: tag
              });
            // Also push to front-end
            $scope.currentVendor.tags.push(tag);
          }
        });

        // Format vendor edit info for back-end
        var processedVendor = {
          vendor: {
            bio: editedVendor.bio,
            profilePictureLocation: editedVendor.profilePictureLocation,
          },
          tags: tagArr,
        };

        // Send processed vendor edit data to server
        var id = $scope.currentVendor.id;
        VendorService.editVendor(processedVendor, id);

        // Grab edit data, save changes in localStorage
        $scope.currentVendor.bio = editedVendor.bio;
        $scope.currentVendor.profilePictureLocation = editedVendor.profilePictureLocation;
        localStorage.currentVendor = $scope.currentVendor;
        $state.go('tab.dashboard-detailview');
      };
    });
