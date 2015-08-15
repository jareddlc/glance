var async = require('async');
var cache = require('memory-cache');
var config = require('./config');
var CronJob = require('cron').CronJob;
var GitHubApi = require('github');
var log = require('./logger')();

var api = module.exports = {};

api.init = function init(callback) {
  var github = this;
  github.client = new GitHubApi({
    version: '3.0.0',
    protocol: 'https',
    host: 'api.github.com',
    timeout: 5000,
    headers: {
      'user-agent': 'glance'
    }
  });

  if(config.github.auth.type === 'oauth') {
    github.client.authenticate(config.github.auth);
  }
  if(config.github.auth.type === 'basic') {
    github.client.authenticate(config.github.auth);
  }

  if(config.github.org.name) {
    github.canGetAllReposFromOrg = true;
    github.canGetAllPullRequestsFromOrg = true;
    cache.put('org', {name: config.github.org.name});
  }
  else {
    github.canGetAllReposFromOrg = false;
    github.canGetAllPullRequestsFromOrg = false;
  }
  log.info('Github: Initialized');
  callback(null);
};

api.start = function start(callback) {
  var github = this;
  new CronJob(config.github.cron, function() {
    if(github.canGetAllReposFromOrg) {
      log.debug('getAllReposFromOrg CronJob fired, making request');
      github.canGetAllReposFromOrg = false;
      github.getAllReposFromOrg(function() {
        github.canGetAllReposFromOrg = true;
      });
    }
    else {
      log.warn('getAllReposFromOrg CronJob fired, but last request still pending');
    }
  }, null, true);

  new CronJob(config.github.cron, function() {
    if(github.canGetAllPullRequestsFromOrg) {
      log.debug('getAllPullRequestsFromOrg CronJob fired, making request');
      github.canGetAllPullRequestsFromOrg = false;
      github.getAllPullRequestsFromOrg(function() {
        github.canGetAllPullRequestsFromOrg = true;
      });
    }
    else {
      log.warn('getAllPullRequestsFromOrg CronJob fired, but last request still pending');
    }
  }, null, true);

  callback(null);
};

api.getAllReposFromOrg = function getAllReposFromOrg(callback) {
  var github = this;
  var req = {
    org: config.github.org.name,
    type: 'all',
    sort: 'full_name',
    direction: 'asc',
    page: 0,
    per_page: 100
  };
  github.client.repos.getFromOrg(req, function(err, res) {
    if(err) {
      log.error({err: err}, 'Error - Github: getAllReposFromOrg');
    }
    else {
      var reposFromOrg = [];
      async.each(res, function(r, cb) {
        var repo = {
          id: r.id,
          name: r.name,
          full_name: r.full_name,
          description: r.description,
          private: r.private,
          open_issues_count: r.open_issues_count,
          open_issues: r.open_issues,
          size: r.size,
          created_at: r.created_at,
          updated_at: r.updated_at,
          pushed_at: r.pushed_at
        };
        reposFromOrg.push(repo);
        cb(null);
      }, function(err) {
        if(err) {
          log.error({err: err}, 'Error - Github: parsing getAllReposFromOrg');
        }
        else {
          log.info({reposFromOrg: reposFromOrg}, 'Github: getAllReposFromOrg');
        }
        cache.put('reposFromOrg', reposFromOrg);
        callback(null);
      });
    }
  });
};

api.getAllPullRequestsFromOrg = function getAllPullRequestsFromOrg(callback) {
  var github = this;
  var repos = cache.get('reposFromOrg') || [];
  var req = {
    user: config.github.org.name,
    repo: 'repo',
    sort: 'created',
    direction: 'asc',
    page: 0,
    per_page: 100
  };
  var pullRequestsFromOrg = [];
  async.each(repos, function(r, cb) {
    req.repo = r.name;
    github.client.pullRequests.getAll(req, function(err, res) {
      if(err) {
        log.error({err: err}, 'Error - Github: getAllPullRequestsFromOrg');
      }
      else {
        for(var i = 0; i < res.length; i++) {
          var pr = {
            id: res[i].id,
            title: res[i].title,
            repo_id: res[i].head.repo.id,
            repo_name: res[i].head.repo.name,
            state: res[i].state,
            number: res[i].number,
            created_at: res[i].created_at,
            updated_at: res[i].updated_at,
            closed_at: res[i].closed_at,
            merged_at: res[i].merged_at,
          }
          pullRequestsFromOrg.push(pr);
        }
        cb(null);
      }
    });
  }, function(err) {
    if(err) {
      log.error({err: err}, 'Error - Github: parsing getAllPullRequestsFromOrg');
    }
    else {
      log.info({pullRequestsFromOrg: pullRequestsFromOrg}, 'Github: getAllPullRequestsFromOrg');
      cache.put('pullRequestsFromOrg', pullRequestsFromOrg);
      callback(null);
    }
  });
};
