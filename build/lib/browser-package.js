import fs from 'fs'
import path from 'path'
import config from './config.js'
import Build from './build.js'

let build = new Build()
let outdir = config.browserOutput + '/browser-ngn'
// let mapfile = `${outdir}/${ngn.name}-${ngn.version}.min.js.map`

// 1. Retrieve package
const mainpkg = build.pkg
// const mainpkg = JSON.parse(fs.readFileSync('../package.json').toString())
delete mainpkg.scripts

build.supportedBrowsers().forEach(edition => {
  const originalEditionName = edition
  edition = `browser-${build.name}` + (edition !== 'current' ? '-' + edition.trim() : '')

  const prefix = `${config.npmOrganization}${config.npmOrganization.trim().length > 0 ? '/' : ''}`
  outdir = `${config.browserOutput}/${edition}`
  const srcfile = `${config.browserOutput}/browser-ngn/${ngn.name}-${ngn.version}${edition.replace('browser-ngn', '')}.min.js`

  console.log(`Creating production npm package for ${edition}`)
  const pkg = Object.assign({}, mainpkg)
  pkg.name = `${prefix}${edition}`
  pkg.description = `${mainpkg.description} (Production code for ${originalEditionName} browsers)`
  pkg.devDependencies = {}
  pkg.devDependencies[`${prefix}${edition}-debug`] = mainpkg.version
  pkg.module = `./${ngn.name}-${ngn.version}${edition.replace('browser-ngn', '')}.min.js`
  pkg.main = `./${ngn.name}-${ngn.version}${edition.replace('browser-ngn', '')}.min.js`

  if (!fs.existsSync(outdir)) {
    fs.mkdirSync(outdir)
  }

  // Update the source map URLs
  let content = fs.readFileSync(srcfile)
    .toString()
    .replace(/\/+#\s+?sourceMappingURL=/, `//# sourceMappingURL=../${edition}-debug/`)
  fs.writeFileSync(srcfile, content)

  if (originalEditionName === 'current') {
    let globalFile = srcfile.replace('.min.js', '-global.min.js')
    content = fs.readFileSync(globalFile)
      .toString()
      .replace(/\/+#\s+?sourceMappingURL=/, `//# sourceMappingURL=../${edition}-debug/`)
    fs.writeFileSync(globalFile, content)
    fs.renameSync(srcfile.replace('.min.js', '-global.min.js'), `${outdir}/${ngn.name}-${ngn.version}${edition.replace('browser-ngn', '')}-global.min.js`)
  }

  fs.renameSync(srcfile, `${outdir}/${ngn.name}-${ngn.version}${edition.replace('browser-ngn', '')}.min.js`)
  fs.writeFileSync(`${outdir}/package.json`, JSON.stringify(pkg, null, 2))

  // Add license
  fs.copyFileSync('../LICENSE', `${outdir}/LICENSE`)

  // Add README
  fs.writeFileSync(`${outdir}/README.md`, `# ${pkg.name} ${pkg.version} (${originalEditionName}${originalEditionName !== 'current' ? ' legacy' : ''} edition)\n\nPlease see [${build.homepage}](${build.homepage}).\n\nGenerated on ${(new Date())}.`)

  console.log(`Creating debug npm package for ${edition}.`)
  fs.mkdirSync(`${outdir}-debug`)
  fs.renameSync(srcfile.replace('.min.js', '.min.js.map'), `${outdir}-debug/${ngn.name}-${ngn.version}${edition.replace('browser-ngn', '')}.min.js.map`)
  if (originalEditionName === 'current') {
    fs.renameSync(srcfile.replace('.min.js', '-global.min.js.map'), `${outdir}-debug/${ngn.name}-${ngn.version}-global.min.js.map`)
  }

  delete pkg.type
  delete pkg.devDependencies
  pkg.name = `${pkg.name}-debug`
  pkg.description = `${mainpkg.description} (Sourcemaps for ${originalEditionName} browsers)`
  pkg.module = `./${ngn.name}-${ngn.version}${edition.replace('browser-ngn', '')}.min.js.map`
  pkg.main = `./${ngn.name}-${ngn.version}${edition.replace('browser-ngn', '')}.min.js.map`
  pkg.dependencies = {}
  pkg.dependencies['source-map-support'] = mainpkg['source-map-support']
  fs.writeFileSync(`${outdir}-debug/package.json`, JSON.stringify(pkg, null, 2))

  // Add license
  fs.copyFileSync('../LICENSE', `${outdir}-debug/LICENSE`)

  // Add README
  fs.writeFileSync(`${outdir}-debug/README.md`, `# ${pkg.name} ${pkg.version} (${originalEditionName} edition)\n\nPlease see [${build.homepage}](${build.homepage}).\n\nGenerated on ${(new Date())}.`)
})

// Apply banner to all JS files
ngn.walk(config.browserOutput).forEach(filepath => {
  if (path.extname(filepath) === '.js') {
    fs.writeFileSync(filepath, config.banner + '\n' + fs.readFileSync(filepath).toString())
  }
})
