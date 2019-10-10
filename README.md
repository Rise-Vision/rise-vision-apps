# Rise Vision Apps [![Circle CI](https://circleci.com/gh/Rise-Vision/rise-vision-apps.svg?style=svg)](https://circleci.com/gh/Rise-Vision/rise-vision-apps) [![Coverage Status](https://coveralls.io/repos/Rise-Vision/rise-vision-apps/badge.svg?branch=&service=github)](https://coveralls.io/github/Rise-Vision/rise-vision-apps?branch=)
==============


## Introduction

Rise Vision Apps is our apps launcher built with AngularJS.

Project Name works in conjunction with [Rise Vision](http://www.risevision.com), the [digital signage management application](http://rva.risevision.com/) that runs on [Google Cloud](https://cloud.google.com).

At this time Chrome is the only browser that this project and Rise Vision supports.

## Built With
- *[NPM](https://www.npmjs.org/)*
- *[AngularJs](https://angularjs.org/)*
- *[Bower](http://bower.io/)*
- *[Gulp.js](http://gulpjs.com/)*
- *[Common-Style](http://rise-vision.github.io/style-guide/)*
- *[JQuery](http://jquery.com/)*

## Development

### Local Development Environment Setup and Installation

* install npm

* clone the repo using Git to your local:
```bash
git clone https://github.com/Rise-Vision/rise-vision-app-launcher.git
```

* install all javascript libs such as gulp
```bash
npm install
```

* download components with bower
```bash
bower install
```

### Run Local

* under the root directory run gulp default task which will build and watch directories for changes
so building and reloading the browser after a change
```bash
gulp
```

* If browser hasn't opened, you can open it on http://localhost:8000

### Staging summary

When pushing changes to chore/fix/feature branches, an optional staging environment can be indicated at the end of the commit message. The format is [stage-x], with x ranging from 0 to 9 (defaulting to 0, in case it's not provided).

#### Staging Assignments by Team

Please check the staging assignment in [this article](https://help.risevision.com/hc/en-us/articles/360001203463-Apps-Stage-Environments).


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


## Testing

### Unit Testing
```
gulp test:unit
```

### Protractor End-to-End Testing

E2E tests require `E2E_USER` and `E2E_PASS` environment variables to be defined with the Google account used for testing:

```
E2E_USER=jenkins@risevision.com E2E_PASS=... gulp test:e2e
```

#### Susbcribed vs Non Susbscribed Test Companies
When adding new E2E tests, you can opt to run them on the main test company or create a new subcompany to start from a clean environment.
The main test company is subscribed to a plan, and has two subcompanies: `Jenkins Subscribed Subcompany` and `Jenkins Unsubscribed Subcompany`. As implied by their names, one is subscribed to a plan and the other isn't. You can use those companies accordingly, or create sub companies of them that will inherit their subscription statuses.  

#### Parallel Builds
Tests that may cause conflicts when running in parallel are isolated by appending the staging name to its resources. For instance, by sufixing a new subcompany name with the stage name. The staging name can be retrieved via `commonHeaderPage.getStageEnv()`.

#### User Registration Tests 
In similar fashion, when running user registration tests, the stage name is appended to create a unique user per stage environment, to prevent conflicts.

This is achieved by using [plus addressing](https://will.koffel.org/post/2014/using-email-plus-addressing/). In summary, from single email account you can have multiple 'aliases' by appending `+` and an identifier. In our case, we use `jenkins.rise@homail.com` as the main account and `jenkins.rise+stage1@hotmail.com`, `jenkins.rise+stage2@hotmail.com`, etc, for the user registration tests on respective staging environments.

#### Mail Listener
Some funtionalities like registering a new user or adding a new user to a company send emails to users.
To test that emails are properly delivered, E2E tests use the [MailListener](https://github.com/Rise-Vision/rise-vision-apps/blob/master/test/e2e/common-header/utils/mailListener.js) service, which connects via IMAP and checks user emails. 
Same as above, it will use `jenkins.rise@homail.com` and filter received emails per stage environment, so that tests can be safely run in parallel without retrieving email messages from other environments.

#### Restoring Jenkins company

In case the Jenkins Company gets removed, which causes all e2e tests to fail, the steps to recreate it are:

- Login with jenkins@risevision.com
- Create a new company with a non-education industry
- Subscribe to a plan (any plan would do). Not a trial, a renewable Subscription. This needs to be done as jenkins@risevision.com
- Go to Company Settings and uncheck *"Share Company Plan”*
- Create an empty presentation named *TEST_E2E_PRESENTATION*
- In Storage, upload an image file named *logo.gif*
- In Storage, create a folder named *E2E_TEST_FOLDER*
- Create a new Subcompany *"Jenkins Subscribed Subcompany"*, susbcribe to a plan with it and confirm it has `Share Company Plan` checked.
- Create a new  subcompany *"Jenkins Unsubscribed Subcompany"*

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

## Contributing
All contributions are greatly appreciated and welcome! If you would first like to sound out your contribution ideas please post your thoughts to our [community](https://help.risevision.com/hc/en-us/community/topics/), otherwise submit a pull request and we will do our best to incorporate it

### Languages

In order to support languages i18n needs to be added to this repository.  Please refer to our Suggested Contributions.

### Suggested Contributions
- We could use i18n Language Support

## Resources
If you have any questions or problems please don't hesitate to join our lively and responsive community at https://help.risevision.com/hc/en-us/community/topics/.

If you are looking for user documentation on Rise Vision please see http://www.risevision.com/help/users/

If you would like more information on developing applications for Rise Vision please visit http://www.risevision.com/help/developers/.

**Facilitator**

[Rodrigo Serviuc Pavezi](https://github.com/rodrigopavezi "Rodrigo Serviuc Pavezi")

