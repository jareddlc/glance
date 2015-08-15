var cache = require('memory-cache');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', {title: 'Glance'});
});

router.get('/api', function(req, res) {
  res.json({
    orgs: '/orgs (JSON) - The name of the github organization.',
    orgs_repos: '/orgs/repos (ARRAY) - List all the repos from the github organization.',
    orgs_repos_pulls: '/orgs/repos/pulls (ARRAY) - List all the pull requests from the github organization'
  });
});

router.get('/api/orgs', function(req, res) {
  var org = cache.get('org') || {};
  res.json(org);
});

router.get('/api/orgs/repos', function(req, res) {
  var reposFromOrg = cache.get('reposFromOrg');
  res.json(reposFromOrg);
});

router.get('/api/orgs/repos/pulls', function(req, res) {
  var pullRequestsFromOrg = cache.get('pullRequestsFromOrg');
  res.json(pullRequestsFromOrg);
});

module.exports = router;
