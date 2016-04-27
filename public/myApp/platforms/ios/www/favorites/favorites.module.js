angular
  .module('favorites', [
    'ui.router'
  ])
  .config(function ($stateProvider) {
      $stateProvider
      // ADVANCED SEARCH TAB
      // Advanced search form

      // FAVORITES MAP TAB
      // Map of user's favorite trucks centered on user's location
      .state('tab.fav-map', {
        cache: false,
        url: '/favorites',
        views: {
          'tab-favorites': {
            templateUrl: 'favorites/views/tab-favorites.html',
            controller: 'FavMapCtrl'
          }
        }
      })

      // LIST VIEW TAB
      // List view of user's favorite trucks
      .state('tab.fav-list', {
        url: '/fav-list',
        views: {
          'tab-favorites': {
            templateUrl: 'favorites/views/tab-favorites-listview.html',
            controller: 'FavListviewCtrl'
          }
        }
      })

      // DETAIL VIEW TAB
      // Detailed profile view of selected favorite truck
      .state('tab.fav-detailview', {
        url: '/fav-list/:truckId',
        views: {
          'tab-favorites': {
            templateUrl: 'favorites/views/tab-favorites-detailview.html',
            controller: 'FavDetailviewCtrl'
          }
        }
      });
    });
