angular
  .module('search')
  .controller('SearchCtrl', function($scope, SearchService) {
    $scope.searchOptions = {};
    $scope.searchOptions.tags = [];


    // Declare edited vendor object, tags as an array


    // SEND SEARCH OPTIONS TO SERVER, CACHE RESPONSE FOR MAP
    $scope.sendSearchOptions = function(searchOptions) {
      console.log('searchOptions: ' + $scope.searchOptions);
      window.search = $scope.searchOptions;
      // Process tag checkboxes for back-end
      var tagArr = [];
      searchOptions.tags.forEach(function(tag, idx) {
        // If a tag is selected, push into tags array
        if (tag) {
          tagArr.push(
            {
              id: idx,
              tag: tag
            });
        }
      });

      // Format vendor edit info for back-end
      var processedOptions = {
        keyword: searchOptions.keyword,
        tags: tagArr,
      };

      console.log(processedOptions);
      window.opts = processedOptions;
      // Send processed search options to server
      SearchService.sendSearchOptions(processedOptions).then(function(response) {
        $scope.trucks = response;
      }, function(error) {
        console.log("ERROR", error);
      });
    };

  })

  .controller('SearchMapCtrl', function($scope, $state, $cordovaGeolocation, SearchService, $compile) {
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

      $scope.map = new google.maps.Map(document.getElementById("search-map"), mapOptions);
      console.log('map',$scope.map);
      var marker = new google.maps.Marker({
        position: latLng,
        map: $scope.map,
        icon: 'logo-pin-here.png'
      });

      marker.setMap($scope.map);

      // SEARCH VENDORS SHOULD BE IN CACHE
      SearchService.getTrucksFromCache().then(function(trucks) {
        $scope.trucks = trucks;
        if ($scope.trucks) {
          $scope.trucks.forEach(function(truck) {
            var marker = new google.maps.Marker({
              position: truck.location,
              map: $scope.map,
              icon: 'logo-pin-shadow-white-sm.png',
            });

            var contentString = "<div><a ng-href='#/tab/search-list/" + truck.id + "'>" + truck.vendorName + "</a></div>";
            var compiled = $compile(contentString)($scope);
            var infowindow = new google.maps.InfoWindow({
              content: compiled[0]
            });

            google.maps.event.addListener(marker, 'click', function() {
              infowindow.open($scope.map,marker);
            });

            marker.setMap($scope.map);
          });
        }
      });

      }, function(error){
      console.log("Could not get location");
    });
  })

  .controller('SearchListviewCtrl', function($scope, SearchService, FavoritesService){
    SearchService.getTrucksFromCache().then(function(trucks) {
      $scope.trucks = trucks;
      $scope.addFavoriteTruck = function (truckId, heart) {
        FavoritesService.addFavoriteTruck(truckId, heart);
      };
    });
  })

  .controller('SearchDetailviewCtrl', function($scope, $stateParams, SearchService, FavoritesService) {
    $scope.addFavoriteTruck = function (truckId, heart) {
      FavoritesService.addFavoriteTruck(truckId, heart);
    };
    $scope.truck = SearchService.getTruck($stateParams.truckId);

    $scope.hasContent = function() {
      return $scope.truck.location.tweet || $scope.truck.location.imageUrl;
    };

    var mapOptions = {
      center: $scope.truck.location,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map-detail"), mapOptions);

    var marker = new google.maps.Marker({
      position: $scope.truck.location,
      map: $scope.map,
      icon: 'logo-pin-shadow-white-sm.png',
    });

    marker.setMap($scope.map);

    $scope.truck.location.created = new Date().toLocaleTimeString().replace("/.*(\d{2}:\d{2}:\d{2}).*/", "$1");

  });
