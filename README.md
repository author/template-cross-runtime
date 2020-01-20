# Cross Runtime Template

This Github template provides all of the common scaffolding/scripts needed to produce modern/testable JavaScript libraries for multiple different runtimes (i.e. browsers and Node.js).

## Getting Started

This template contains a LOT of features, because properly releasing JS libraries is a silly complicated process. 

This template requires Node 12.0.0+ (13.0.0+ recommended). 

We recommend [NVM for Windows](https://github.com/coreybutler/nvm-windows) (we wrote it, we're biased) if you need to update.
```sh
nvm install 13.5.0
nvm use 13.5.0
```

**Here's what you need to know to start working right now:**

1. It's designed for ES Modules, i.e. libraries, not "apps".
1. Run `npm run setup` to configure the new environment.
1. Update `package.json` in the root directory. At least update the name :-)
1. The `src` directory has some bare bones code. Start working there.
1. The `test` and `build` directories contain everything needed to test and release your code. You don't need to do anything (other than creating your unit tests).
1. Unit tests are in `test/unit/`. They follow a numeric semantic. A basic "hey it loads" sanity test exists to get you started.
1. Run any of the following:
    - `npm test` the entire library in all runtimes (Node + Browser)
    - `npm run test:node` to just test in Node.
    - `npm run test:browser` to just test in the browser (defaults to Chrome).
    - `npm run manually` to launch a manual testing environment. This relies on [Fenix Web Server 3.0.0](https://preview.fenixwebserver.com) (free).
1. This document is unnecessary once you're setup, but you might want to rename it to `BUILD.md` and keep it around for others who need to work on the project.

---
# Core Concepts

This template addresses the following concepts/challenges:

- Build (Transpile, Minification)
- Unit Testing
- Syntax Testing
- Compatibility Reporting
- Packaging (for npm)
- Manual Testing

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
