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
                    + '<div class="">'
                      + '<div>Repo: ' + scope.pr.repo_name + '<span class="pull-right">' + dateFilter(scope.pr.created_at) + '</span></div>'
                      + '<div>Title: ' + scope.pr.title + '<span class="pull-right">' + scope.pr.state + '</span></div>'
                    + '</div>'
                  + '</div>'
                + '</div>';
        return html;
      };

      scope.$watchCollection('pr', prUpdate);
    }
  };
}]);
