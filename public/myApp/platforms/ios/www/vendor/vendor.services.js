angular
    .module('vendor')
.factory('VendorService', function($http, $q, $cacheFactory) {
  var cacheEngine = $cacheFactory('vendor');
  var ip = "http://10.0.10.70:8080";
  // var ip = "http://localhost:8080";
  var loginUrl = ip + "/vendor/login";
  var signupUrl = ip + "/vendor";
  var vendorsURL = ip + "/vendor/location";

  function signup(vendor){
    var currentVendor = $http.post(signupUrl, vendor);
    window.localStorage.setItem( 'currentVendor', JSON.stringify(vendor) );
    window.localStorage.setItem( 'vendorLoggedIn', true );
    return currentVendor;
  }

  function dropPin(post, vendorId){
    var url = ip + "/vendor/" + vendorId + "/location";
    // post.expiresString =  new Date().toISOString().slice(0, 19);
    console.log("OBJECT BEING SENT", post);
    return $http.post(url, post);
  }

  function getCurrentVendors() {
      var defer = $q.defer();
      var cache = cacheEngine.get('vendors');
      // IF cache already contains vendors, use those
      if(cache) {
        console.log('found trucks in the cache');
        defer.resolve(cache);
      }
      // ELSE get vendors from server, put them in cache
      else {
        console.log('no trucks in cache. getting from service');
        $http.get(vendorsURL).then(function(response) {
          var trucks = response.data;
          if (localStorage.getItem("currentVendor")) {
            favArr = JSON.parse(localStorage.getItem("currentVendor"));
          }
          trucks.forEach(function(truck) {
            if(localStorage.getItem("currentVendor")) {
              if(favArr.indexOf(truck.id)>-1) {
                truck.heart = true;
              } else {
                truck.heart = false;
              }
            } else {
              localStorage.setItem("currentVendor")
            }
          });

          cacheEngine.put('vendors',  currentVendor);
          defer.resolve(currentVendor);
      });
      }
      return defer.promise;
  }

  function loginVendor(login){
    var defer = $q.defer();

    $http.post(loginUrl, login).then(function(response) {
      defer.resolve(response.data);
      window.localStorage.currentVendor = JSON.stringify(response.data);
      window.localStorage.vendorLoggedIn = true;
    });

    return defer.promise;
  }

  function logoutVendor(){
    // Hit hypothetical logout route
    // var vendor = JSON.parse(localStorage.currentVendor);
    // var logoutUrl = "/vendor/" + vendor.id + "/logout";
    // $http.post(logoutUrl);
    window.localStorage.vendorLoggedIn = false;
    window.localStorage.currentVendor = '';
    console.log("in localStorage: " + JSON.stringify(localStorage.currentVendor));
  }

  function editVendor(editedVendor, vendorId){
    var url = ip + "/vendor/" + vendorId;
    $http.put(url, editedVendor);
  }


  return {
    signup: signup,
    dropPin: dropPin,
    loginVendor: loginVendor,
    logoutVendor: logoutVendor,
    editVendor: editVendor,
    getCurrentVendors: getCurrentVendors,
  };
});
