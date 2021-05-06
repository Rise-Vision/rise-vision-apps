# Rise Vision Apps [![Circle CI](https://circleci.com/gh/Rise-Vision/rise-vision-apps.svg?style=svg)](https://circleci.com/gh/Rise-Vision/rise-vision-apps) [![Coverage Status](https://coveralls.io/repos/Rise-Vision/rise-vision-apps/badge.svg?branch=&service=github)](https://coveralls.io/github/Rise-Vision/rise-vision-apps?branch=)

## Introduction

Rise Vision Apps is the frontend application for managing digital signage for the Rise Vision platform.


## Built With

### Languages

- *[Javascript (ES5)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)*
- *[Typescript](https://www.typescriptlang.org/)*

### Frameworks

- *[Angular](https://angular.io/)*
- *[AngularJs](https://angularjs.org/)*
- *[Sass](https://sass-lang.com/)*
- *[Bootstrap 3](https://getbootstrap.com/docs/3.3/)*

Given AngularJS is deprecated, Apps is currently in the process of migrating to Angular (more details in [this doc](https://docs.google.com/document/d/1Lha7Uf7kGjdhOb95k3V1jyW0xk3L6jYzvD-6PUf3MWg/edit#)). New features must be implemented in Angular as much as possible, and when working with AngularJS code, consider upgrading it to Angular.

**Note:** Following Angular naming convention, Angular 1.x is referred to as AngularJS, while Angular 2+ versions are referred to as Angular.

### Build Tools

- *[Node 10+](https://nodejs.org/)*
- *[Angular CLI](https://angular.io/cli)*
- *[Gulp.js](http://gulpjs.com/)*
- *[CircleCI](https://circleci.com/gh/Rise-Vision/workflows/rise-vision-apps)*
- *[Github](https://github.com/Rise-Vision/rise-vision-apps)*

### Testing Tools

- *[Protractor](https://www.protractortest.org/#/)*
- *[Karma](https://karma-runner.github.io/)*
- *[Mocha](https://mochajs.org/)*
- *[Chai](https://www.chaijs.com/)*
- *[SinonJS](https://sinonjs.org/)*
- *[Coveralls](https://coveralls.io/github/Rise-Vision/rise-vision-apps)*

### Package management

- *[NPM](https://www.npmjs.org/)*
- *[Bower](http://bower.io/)*

## Supported Browsers
The following browsers are supported, mobile and desktop, in their latest versions:

- Chrome
- Safari
- Edge


## Development

### Local Development Environment Setup and Installation

* install node & npm

* clone the repo using Git to your local:
```bash
git clone https://github.com/Rise-Vision/rise-vision-apps.git
```

* install all javascript libs such as gulp
```bash
npm install
```

* download components with bower
```bash
bower install
```

* For info for useful tasks
```bash
gulp
```

### Run Local

#### Angular

* Start a server at port 8000 and watch angular files
```bash
npm run ng-serve
```

* Build angular & angularjs to the dist folder
```bash
npm run ng-build
```

* Start a server at port 8000 for the dist folder
```bash
gulp dist-server
```

* Code scaffolding - to generate a new component
```bash
npm run ng generate component component-name
```

* You can also use:
```bash
npm run ng generate directive|pipe|service|class|guard|interface|enum|module
```

#### AngularJS

* Build angularjs to dist
```bash
gulp build
```

* Watch angularjs tests & partials
```bash
gulp watch
```

## Testing

### Unit Testing
```bash
gulp test:unit
```

### Protractor End-to-End Testing

E2E tests require some environment variables to be defined for the accounts used for testing. The variables are `E2E_USER` / `E2E_PASS` for Google Authentication and `E2E_USER1` / `E2E_PASS1` for Custom Authentication and can be confirmed by reaching out to the Apps team. The command would be as follows:

```bash
E2E_USER=... E2E_PASS=... E2E_USER1=... E2E_PASS1=... gulp test:e2e
```

#### Susbcribed vs Non Susbscribed Test Companies
When adding new E2E tests, you can opt to run them on the main test company or create a new subcompany to start from a clean environment.
The main test company is subscribed to a plan, and has two subcompanies: `Jenkins Subscribed Subcompany` and `Jenkins Unsubscribed Subcompany`. As implied by their names, one is subscribed to a plan and the other isn't. You can use those companies accordingly, or create sub companies of them that will inherit their subscription statuses.  

#### Parallel Builds
Tests that may cause conflicts when running in parallel are isolated by appending the staging name to its resources. For instance, by sufixing a new subcompany name with the stage name. The staging name can be retrieved via `commonHeaderPage.getStageEnv()`.

#### User Registration Tests 
In similar fashion, when running user registration tests, the stage name is appended to create a unique user per stage environment, to prevent conflicts.

This is achieved by using [plus addressing](https://will.koffel.org/post/2014/using-email-plus-addressing/). In summary, from single email account you can have multiple 'aliases' by appending `+` and an identifier. In our case, we use `jenkins.rise@gmail.com` as the main account and `jenkins.rise+stage1@gmail.com`, `jenkins.rise+stage2@gmail.com`, etc, for the user registration tests on respective staging environments.

#### Restoring Jenkins company

In case the Jenkins Company gets removed, which causes all e2e tests to fail, the steps to recreate it are:

- Login with jenkins.rise@gmail.com
- Create a new company with a non-education industry
- Subscribe to a plan (any plan would do). Not a trial, a renewable Subscription. This needs to be done as jenkins.rise@gmail.com
- Go to Company Settings and uncheck *"Share Company Plan”*
- Create an empty presentation named *TEST_E2E_PRESENTATION*
- In Storage, upload an image file named *logo.gif*
- In Storage, create a folder named *E2E_TEST_FOLDER*
- Create a new Subcompany *"Jenkins Subscribed Subcompany"*, susbcribe to a plan with it and confirm it has `Share Company Plan` checked.
- Create a new  subcompany *"Jenkins Unsubscribed Subcompany"*
- Under *"Jenkins Unsubscribed Subcompany"* create a new  subcompany *"E2E SUBCOMPANY - UNSUBSCRIBED"*

## Deployment Environments

When pushing changes to chore/, fix/ or feature/ branches, a staging environment needs to be indicated at the end of the commit message. The format is [stage-x], with x ranging from 1 to 20.

You can also push changes to a stage/ branch, which will stage directly and skip running unit and e2e test.

You can also push changes to a beta/ branch, which will stage a production version of the app. This requires the build's unit and e2e tests to pass.

#### Check which Stage is in Use

In order to check which staging environment is not currently being used, ```./currently-staged.sh``` can be ran in the root directory of the repository. The command's output is:

```
This command will show which branch has the latest commit referencing a given staging environment.
If a staging environment is not listed, it means it is not currently in use by any active branch.
Warning: this command will not show information about stage-0, unless it appears in the commit message
If you have not ran git pull/git fetch in a while, you may want to run: git fetch --prune

[stage-3] - 2017-12-13 15:31:54 -0300 - Commit user 1           - chore/branch-name
[stage-2] - 2017-12-12 17:22:15 -0300 - Commit user 2           - release/branch-name

```

Because of the way git works (mainly, references to remote repositories), it's important to have an up to date copy of the repository. The proposed command, ```git fetch --prune```, will retrieve the latest branches from GitHub and remove no longer existing references to branches. It will NOT remove local branches and it will not merge into working copies, which means unless you are doing something really specific with your repository, it's safe to run.

## Submitting Issues

If you encounter problems or find defects we really want to hear about them. If you could take the time to add them as issues to this Repository it would be most appreciated. When reporting issues please use the following format where applicable:

**Reproduction Steps**

1. did this
2. then that
3. followed by this (screenshots / video captures always help)

**Expected Results**

What you expected to happen.

**Actual Results**

What actually happened. (screenshots / video captures always help)

## Help
Please visit our [Help Center](https://help.risevision.com/).

**Facilitator**

[Rise Vision](https://github.com/rise-vision "Rise Vision")
