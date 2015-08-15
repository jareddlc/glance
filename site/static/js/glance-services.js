var glanceServices = angular.module('glanceServices', ['ngResource']);

glanceServices.factory('glanceService', ['$rootScope', '$resource', '$timeout',
  function($rootScope, $resource, $timeout) {

    // $resource endpoints
    var orgsService = $resource('/api/orgs', {}, {
      get: {method: 'GET', isArray: false}
    });

    var reposFromOrgService = $resource('/api/orgs/repos', {}, {
      get: {method: 'GET', isArray: true}
    });

    var pullRequestsFromOrgService = $resource('/api/orgs/repos/pulls', {}, {
      get: {method: 'GET', isArray: true}
    });

    // vars
    var REFRESH_RATE = 5000;
    var org = {};
    var reposFromOrgList = [];
    var pullRequestsFromOrgList = [];

    // refresh data
    var refreshOrg = function refreshOrg() {
      orgsService.get(function(data) {
        if(!angular.equals(org, data)) {
          angular.copy(data, org);
        }
      });
      $timeout(refreshOrg, REFRESH_RATE);
    };
    refreshOrg();

    var refreshReposFromOrg = function refreshReposFromOrg() {
      reposFromOrgService.get(function(data) {
        if(!angular.equals(reposFromOrgList, data)) {
          angular.copy(data, reposFromOrgList);
        }
      });
      $timeout(refreshReposFromOrg, REFRESH_RATE);
    };
    refreshReposFromOrg();

    var refreshPullRequestsFromOrg = function refreshPullRequestsFromOrg() {
      pullRequestsFromOrgService.get(function(data) {
        if(!angular.equals(pullRequestsFromOrgList, data)) {
          angular.copy(data, pullRequestsFromOrgList);
        }
      });
      $timeout(refreshPullRequestsFromOrg, REFRESH_RATE);
    };
    refreshPullRequestsFromOrg();

    // exports
    return {
      getOrg: function getOrg() {
        return org;
      },
      getReposFromOrgList: function getReposFromOrgList() {
        return reposFromOrgList;
      },
      getPullRequestsFromOrgList: function getPullRequestsFromOrgList() {
        return pullRequestsFromOrgList;
      }
    };
  }
]);
