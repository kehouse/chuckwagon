angular
  .module('search', [
    'ui.router'
  ])
  .config(function ($stateProvider) {
      $stateProvider
      // ADVANCED SEARCH TAB
      // Advanced search form
      .state('tab.search', {
        url: '/search',
        views: {
          'tab-search': {
            templateUrl: 'search/views/tab-search.html',
            controller: 'SearchCtrl'
          }
        }
      })

      // SEARCH MAP TAB
      // Map of trucks that fit search criteria centered on user's location
      .state('tab.search-map', {
        url: '/search-map',
        views: {
          'tab-search': {
            templateUrl: 'search/views/tab-search-map.html',
            controller: 'SearchMapCtrl'
          }
        }
      })

      // SEARCH LIST VIEW TAB
      // List view of trucks that fit search criteria
      .state('tab.search-list', {
        url: '/search-list',
        views: {
          'tab-search': {
            templateUrl: 'search/views/tab-search-listview.html',
            controller: 'SearchListviewCtrl'
          }
        }
      })

      // SEARCH DETAIL VIEW TAB
      // Detailed profile view of selected truck that fits search criteria
      .state('tab.search-detailview', {
        url: '/search-list/:truckId',
        views: {
          'tab-search': {
            templateUrl: 'search/views/tab-search-detailview.html',
            controller: 'SearchDetailviewCtrl'
          }
        }
      });
    });
