# Cross Runtime Template

This template provides all of the common scaffolding/scripts needed to release modern/testable JavaScript libraries for multiple different runtimes (i.e. browsers and Node). 

This is really just a huge head start for **creating a great development cadence** on your next project. 

## Overview

This template/workflow is designed for **ES Modules**, i.e. **building _libraries_**. It could be customized for an app, but that is not the primary purpose.

### Core Concepts

This template addresses the following disciplines:

|Concept    |Purpose    |Tooling    |
|-----------|-----------|-----------|
| Build   | Release | Transpiler (Babel), Minifier (Terser) |
| Unit Testing | Test Driven Development (TDD) | TAP (tape), Karma |
| Syntax Testing | Standards | StandardJS |
| Manual Testing | Troubleshooting | Custom Web Environment |

Several reports can be generated to help you confidently advance your project.

|Name  |Command  | Purpose |
|------|---------|---------|
| Syntax | `npm run report:syntax` | Maintaining consistent standards throughout the code base.
| Compatibility | `npm run report:compat` | Identify any incompatibilities in the supported runtimes (Node/Browser) |
| Release | `npm run report:preview` | Understand what is being released. |
| Coverage* | HELP WANTED | Understand how much of the code base has actually been tested. |

_*Code coverage doesn't work well when testing transpiled/minified code. Tools like nyc/instanbul currently run, but produce no output (very clearly throwing silent errors)._

## Getting Started

There are alot of concepts addressed by this template. They're not hard to learn and they're pretty easy to actually use. The template provide all the "heavy-lifting" tools, but you still need to know how to use them. Again, not hard. It's best to familiarize yourself with the workflow by following the steps outline below.

### Requirements

This template requires Node 12.0.0+ (13.0.0+ recommended).

We biasly recommend [NVM for Windows](https://github.com/coreybutler/nvm-windows) (we created it) if you need to update. [n](https://github.com/tj/n) is the closest alternative for *nix systems.

```sh
nvm install 13.5.0
nvm use 13.5.0
```

### Step 1: Install Dependencies

Run `npm run setup` to configure the new environment. This takes a few minutes. 

What you're patiently waiting for is primarily Babel, Rollup, & Karma. There are a silly number of dependencies. 

This stuff is complicated, but we do wish some of the many modules would help [keep npm fit](https://blog.author.io/npm-needs-a-personal-trainer-537e0f8859c6).

[![Whining Meme](https://static.coreybutler.com/template-cross-runtime/fatfiles2.jpg?updated=202021011334)](https://static.coreybutler.com/template-cross-runtime/fatfiles.jpg)

### Step 2: Define Your Project

Update `package.json` in the root directory. 

This is used as the basis for all modules generated by this template (i.e. the master package). We recommend setting the [homepage](https://docs.npmjs.com/files/package.json#homepage) attribute, which will be used to link your project release README's to the main project page. Alternatively, configure the [repository](https://docs.npmjs.com/files/package.json#repository) or the [author](https://docs.npmjs.com/files/package.json#people-fields-author-contributors) (with URL) attributes. If no URL can be derived, an attempt is made to generate one from npm.

![package.json](https://static.coreybutler.com/template-cross-runtime/package-setup.png)

### Step 3: Run A Test

There are several kinds of tests. All are stored in the `test` directory.

The `src` directory has some bare bones code. It's intentionally simplistic.

#### Running Node.js Tests

The code will always by built and packaged the same way it would be for a production release, in its minified form. All builds include sourcemaps, making it possible to easily trace errors back to their original source (this is built in to the scripts).

```sh
npm run test:node
```

![test_node](https://static.coreybutler.com/template-cross-runtime/test-node.gif)

#### Running Browser Tests

Browser tests are built the same way the Node ones are (i.e. minified with sourcemaps). Karma is used to launch tests in real browsers. By default, only Chrome runs, but the other major browsers are supported too. Modify the file at `test/unit/karma.conf.cjs` to change the browsers.

> Notice the `.cjs` extension for the Karma configuration file. Unfortunately, Karma still only supports CommonJS. Lucikily, Node.js supports the `.cjs` extension to use CommonJS instead of ES Modules, allowing Karma to run without impacting the rest of this test environment.

```sh
npm run test:browser
```

![browser_test](https://static.coreybutler.com/template-cross-runtime/test-browser.gif)

This command launches the browser window for the test process, then closes it when complete:

<img src="https://static.coreybutler.com/template-cross-runtime/karma.png" alt="Karma Test Runner" style="border:2px solid #ccc;border-radius:3px;"/>

#### Running Node+Browser Tests

Want to test the entire project automatically?

```sh
npm run test
```
This just runs the Node tests, then the browser tests.

#### Running Manual Browser Tests

Troubleshooting errors in an automated test runner can be difficult. Instead of creating extra code for troublshooting, use the auto-generated web envionrment. This template has a special browser-based coding environment, which is preloaded with all of your packaged scripts and unit tests.

> This feature currently requires [Fenix Web Server 3.0.0 or higher](https://preview.fenixwebserver.com) (one of our _free_ products) to serve the web page properly.

```sh
npm run manually
```

![test_manually](https://static.coreybutler.com/template-cross-runtime/manual.png)

### Step 4: Build A Release

This template supports building production releases.

#### Build Node Packages
![build_node]()

#### Build Browser Packages

![build_browser]()

### Step 5: Publish

This package doesn't publish packages. It is possible to publish any of them by hand using `npm publish`. However; this is not recommended practice.

_A Better Alternative:_

Follow a pseudo-gitflow practice. Whenever a new Github "release" is made, publish it.

To do this, use the [AutoTagger](https://github.com/marketplace/actions/autotagger) (we wrote this one too) Github action to monitor the `package.json` file in the master branch. Anytime the verison changes, the action will create a new Github release. Use your own Github action to respond to new releases and 

Typically, most tests and build processes will occur on a server, using a CI/CD system of some kind. 

1. Unit tests are in `test/unit/`. Tests are stored in organized directories, following a "numeric" naming syntax. 
```
  <##>-<name>
    - <##>-<test>.js
  karma.conf.cjs
  prepareKarmaBrowserSuite.js
  prepareManualTestEnvironment.js
  ```
For example, `01-sanity` contains a unit test file called `01-sanity.js`. This test
A basic "hey it loads" sanity test exists to get you started.
1. Run any of the following:
    - `npm test` the entire library in all runtimes (Node + Browser)
    - `npm run test:node` to just test in Node.
    - `npm run test:browser` to just test in the browser (defaults to Chrome).
    - `npm run manually` to launch a manual testing environment. This relies on [Fenix Web Server 3.0.0](https://preview.fenixwebserver.com) (free).
1. This document is unnecessary once you're setup, but you might want to rename it to `BUILD.md` and keep it around for others who need to work on the project.

---


## Build

The build process transpiles, minifies, & packages code for testing and/or release.

#### Configuring Builds

There is a simple build configuration file, `build/config.json`. By default, it looks like this:

```json
{
  "nodeOutput": "../.dist/node",
  "browserOutput": "../.dist/browser",
  "testOutput": "../test",
  "npmPrefix": "",
  "external": ["os", "fs", "http", "https", "events"]
}
```

_**`nodeOutput`**_ and _**`browserOutput`**_ are the locations where production releases are created. By default, this is a directory called `build/.dist`. The dot syntax is important because the `.gitignore` file excludes almost everything that starts with a dot from your git repo (distributions should not be committed to git).

_**`testOutput`**_ is the location where temporary test directories are created. By default, this is the `test` directory. You probably shouldn't change this.

_**`npmPrefix`**_ is the prefix which will be applied to any npm distributions. This supports npm organizations. For example, setting this to `@author.io` would generate an npm module named `@author.io/example` (the `/<project>` part is appended automatically).

_**`external`**_ tells the bundler to consider these `import` clauses to be external dependencies (i.e. not bundled).

The build process dynamically transpiles and minifies code whenever necessary. [Babel](https://babeljs.org) is used for transpiling. [Terser](https://terser.org/) is used to minify code. Both of these libraries can be difficult to setup, but this template does it for you. _Modifying_ the configurations for each of these tools is pretty easy. Be aware that if you choose to modify
Build processes exist for Node.js and browsers.

### Building for Node.js

_Unlike_ other bundlers, this one **minifies Node code and ships a sourcemap in a separate module as a dev dependency**. This approach reduces the footprint for production use cases, without making it difficult for developers to troubleshoot module issues. We've seen reductions as high as 80%, but are more often 30-40%.

Remember, this template is designed for using ES Modules. However; experimental support was introduced in Node 12 behind a flag. The flag was removed in Node 13, and is "natively" supported in Node 14 (April 2020). Since many users and serverless environments will still need the CommonJS `require` format, a second "legacy" package is produced to support these environments. This is not the recommended way to build for Node, but it is necessary for those who cannot upgrade.

**The following packages are produced:**

- `node-<name>`

 (Transpile)
    - ECMAScript Final Support
    - ECMAScript Stage 3 Example Support
    - Uses Babel for Transpilation
1. Testing
    - Unit Testing
    - Syntax Testing
    - Compatibility Testing
1. Unit Testing
    - Uses [TAP Standard](https://en.wikipedia.org/wiki/Test_Anything_Protocol), leveraging the [tape library](https://github.com/substack/tape) in browsers and Node.js
    - Node
    - Browsers: [TAP] + Karma Test Runner
        - _Includes automatic-preparation of Karma._

1. Build Processes
    - `npm run build`
    - `npm run build:node`
    - `npm run build:node:test`
    - `npm run build:browser`
    - `npm run build:browser:test`
    - Uses Rollup (concatenation), Babel (transpile), & Terser (minification)

1. Starter Test Scaffolding (TAP)
    - `npm run test`
    - `npm run test:node`
    - `npm run test:browser`
    - `npm run syntax`
    - `npm run compatibility`
    - Auto-prepares Karma Test Runner (Browser)

## Getting Started

Create a new repository, [using this one as a template](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template).

1. Run `npm run setup` to setup the initial environments. Run `npm run resetup` if you need to clear/start again.

1. Modify the `package.json` file's name, description, author, license, and anything else your project needs. By default, packages are set to "private" to prevent to prevent publishing to npm. This should be removed if you intend to publish to a registry.

## Github Actions

TODO: Uses Autotagger
TODO: Instructions (or command) for supporting auto-publishing on npm.

## ECMAScript Support

This template supports all current ECMAScript features. Select stage 3 features may be supported as they evolve to final format (stage 4).

Current Stage 3 Support:

- Private/public class attributes and methods.

## Browsers

Browser support is dictated by a browser's support of the ECMAScript specification. This spec changes regularly, making it difficult to consistently support all browsers all the time. In a "best effort" to keep up, this template supports two release types: "current" and "legacy".

"Current" releases are built for the last 2 major versions of modern browsers.

The "Legacy" release conforms to the ES6 standard and works on all browsers which fully support the ES6/ES2015 specification.

> Internet Explorer only supports ES5 and is not supported by default.

The browser build targets are determined using the [browserslist](https://github.com/browserslist/browserslist) project (`build/.browserslistrc`). This can be modified if the app needs to support different targets.
