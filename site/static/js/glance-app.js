var glance = angular.module('glanceApp', ['ngRoute', 'glanceControllers', 'glanceDirectives', 'glanceServices']);

glance.config(['$routeProvider', '$locationProvider',
function($routeProvider, $locationProvider) {

  $routeProvider
    .when('/', {
      templateUrl : 'partials/dashboard.html'
    })
    .when('/:page', {
      templateUrl: function($routeParams) {
        return 'partials/'+$routeParams.page+'.html';
      }
    })
    .when('/:page/:child*', {
      templateUrl: function($routeParams) {
        return 'partials/'+$routeParams.page+'/'+$routeParams.child+'.html';
      }
    })
    .otherwise({
      redirectTo: '/'
    });
}]);
