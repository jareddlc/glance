var glanceControllers = angular.module('glanceControllers', []);

glanceControllers.controller('github',  ['$rootScope', '$scope', 'glanceService',
  function($rootScope, $scope, glanceService) {

    $scope.$watchCollection(glanceService.getOrg, function(org) {
      if(org && org.name) {
        $scope.org = org;
      }
    });

    $scope.$watchCollection(glanceService.getReposFromOrgList, function(reposFromOrgList) {
      if(reposFromOrgList) {
        $scope.reposFromOrgList = reposFromOrgList;
      }
    });

    $scope.$watchCollection(glanceService.getPullRequestsFromOrgList, function(pullRequestsFromOrgList) {
      if(pullRequestsFromOrgList) {
        $scope.pullRequestsFromOrgList = pullRequestsFromOrgList;
      }
    });
  }
]);
