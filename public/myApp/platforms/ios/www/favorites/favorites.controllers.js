angular
  .module('favorites')
  .controller('FavMapCtrl', function($scope, $state, $cordovaGeolocation, FavoritesService, $compile) {


    var options = {timeout: 10000, enableHighAccuracy: true};
    console.log("INITIALIZING MAP");

      $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      console.log("RELOG POS");
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      $scope.map = new google.maps.Map(document.getElementById("fav-map"), mapOptions);
      console.log('map',$scope.map);
      var marker = new google.maps.Marker({
        position: latLng,
        map: $scope.map,
        icon: 'logo-pin-here.png'
      });

      marker.setMap($scope.map);


      FavoritesService.getFavoriteTrucks().then(function(trucks) {
        $scope.trucks = trucks;
        $scope.trucks.forEach(function(truck) {
          var marker = new google.maps.Marker({
            position: truck.location,
            map: $scope.map,
            icon: 'logo-pin-shadow-white-sm.png',
          });

          var contentString = "<div><a ng-href='#/tab/fav-list/" + truck.id + "'>" + truck.vendorName + "</a></div>";
          var compiled = $compile(contentString)($scope);
          var infowindow = new google.maps.InfoWindow({
            content: compiled[0]
          });

          google.maps.event.addListener(marker, 'click', function() {
            infowindow.open($scope.map,marker);
          });

          marker.setMap($scope.map);
        });

        }, function(error){
        console.log("Could not get location");
        });
      })
  })

  .controller('FavListviewCtrl', function($scope, FavoritesService){

      FavoritesService.getFavoriteTrucks().then(function(trucks) {
        $scope.trucks = trucks;
      })
      $scope.$on('favorite:added', function () {
        FavoritesService.getFavoriteTrucks().then(function(trucks) {
          console.log("FAV LIST VIEW CHANGED");
          $scope.trucks = trucks;
          })
      });
        $scope.addFavoriteTruck = function (truckId, heart) {
          FavoritesService.addFavoriteTruck(truckId, heart)
        };

  })

  .controller('FavDetailviewCtrl', function($scope, $stateParams, FavoritesService, HomeService) {

  $scope.truck = HomeService.getTruck($stateParams.truckId);

  $scope.hasContent = function() {
    return $scope.truck.location.tweet || $scope.truck.location.imageUrl;
  };

    $scope.$on('favorite:added', function () {
      FavoritesService.getFavoriteTrucks().then(function(trucks) {
        $scope.trucks = trucks;
      })      })
      $scope.addFavoriteTruck = function (truckId, heart) {
        FavoritesService.addFavoriteTruck(truckId, heart)
      };

    var mapOptions = {
      // center: {lat: -34.397, lng: 150.644},
      center: $scope.truck.location,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map-detail"), mapOptions);

    var marker = new google.maps.Marker({
      position: $scope.truck.location,
      // position: {lat: -34.397, lng: 150.644},
      map: $scope.map,
      icon: 'logo-pin-shadow-white-sm.png',
    });

    marker.setMap($scope.map);

    $scope.truck.location.created = new Date().toLocaleTimeString().replace("/.*(\d{2}:\d{2}:\d{2}).*/", "$1");

  });
