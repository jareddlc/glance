var glanceDirectives = angular.module('glanceDirectives', []);

glanceDirectives.directive('pullRequest', ['$compile', '$filter', function($compile, $filter) {
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      pr: '='
    },
    link: function(scope, element, atrributes) {
      var dateFilter = $filter('date');

      var prUpdate = function prUpdate(pr) {
        $compile(buildHtml())(scope, function(cloned) {
          element.html(cloned);
        });
      };
      var buildHtml = function buildHtml() {
        var html = '<div class="col-md-12">'
                  + '<div class="glance-box-inner">'
                    + '<div class="glance-pr-container">'
                      + '<div class="glance-pr-main"><span class="pull-right glance-pr-created_at">' + dateFilter(scope.pr.created_at) + '</span> <span class="glance-pr-repo_name"> Repo: ' + scope.pr.repo_name + '</span></div>'
                      + '<div class="glance-pr-sub"><span class="pull-right glance-pr-user">' + scope.pr.user + '</span> <span class="glance-pr-title"> Title: ' + scope.pr.title + '</span></div>'
                    + '</div>'
                  + '</div>'
                + '</div>';
        return html;
      };

      scope.$watchCollection('pr', prUpdate);
    }
  };
}]);
