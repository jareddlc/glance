# glance

Dashboard for displaying things


### What is Glance

Glance is a dashboard that displays quick snippets of information. Currently Glance supports GitHub, with features such as getting repositories from a Github Organization as well as listing all the pull request for each repository from the organization.

### Glance runs in CoreOS

Glance was created to be as simple as possible and deploying Glance is as easy as running a docker container. Glance can also be installed into a __CoreOS cluster__ using a CoreOS service file. Take a look at our CoreOS [service file][glance_service] for an example. Glance can also be ran as an application using Node.js by using environment variables to change the default options, see [Getting Started](#getting-started).

We have setup automated Docker Hub builds for Glance [here](https://registry.hub.docker.com/u/yodlr/glance/)

### Getting Started

##### CoreOS

```
$ git clone https://github.com/yodlr/glance.git
$ cd glance
//Edit glance.service and the GITHUB_AUTH_TOKEN and GITHUB_ORG_NAME
$ fleetctl start services/glance.service
```
__NOTE:__ it is necessary to edit the fields `GITHUB_AUTH_TOKEN` & `GITHUB_ORG_NAME` with the corresponding values.

Our example service file is setup to be a Global service listening on port 3000. This can be modified in the CoreOS service file which can be found [here][glance_service].

##### Docker

```
$ docker run --name glance -p 3000:3000 -e GITHUB_ORG_NAME=myorg -e GITHUB_AUTH_TOKEN=mytoken yodlr/glance:latest
```

##### Node.js

To change default options, see [options](#glance-options).
Example with custom option:

```
$ GITHUB_AUTH_TOKEN=mytoken GITHUB_ORG_NAME=myorg npm start
```

### Options

Glance default options. To change the default options, simply set the value of any of the following environment variables.

```
PORT (Default: 3000)
LOG_LEVEL (Default: 'info')
GITHUB_CRON (Default: '0 */15 * * * *', every 15 mins)
GITHUB_AUTH_TYPE (Default: 'oauth')
GITHUB_AUTH_TOKEN (Required by default, unless 'basic' auth type is selected)
GITHUB_AUTH_USERNAME (Required if 'basic' auth type selected)
GITHUB_AUTH_PASSWORD (Required if 'basic' auth type selected)
GITHUB_ORG_NAME (Required)
```

#### Glance is built with:

* [Node.js](https://nodejs.org/)
* [AngularJS](https://angularjs.org/)
* [Bootstrap](https://getbootstrap.com/)
* [Docker](https://www.docker.com/)

[glance_service]: https://github.com/yodlr/glance/blob/master/services/glance.service
