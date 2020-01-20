import path from 'path'
import fs from 'fs'
import Build from '../../build/lib/build.js'
import { deepStrictEqual } from 'assert'

const build = new Build()
const pkg = JSON.parse(fs.readFileSync('../package.json').toString())
const name = pkg.name.split('/').pop()
const sources = fs.readdirSync(path.resolve('./.browser')).filter(i => path.extname(i).split('.').pop() === 'js')
const options = sources.map(src => `<option value="./${src}">import ${name} from './${src}'</option>`)
options.sort((a, b) => {
  if (a.replace(/[^\S0-9]/gi, '') > b.replace(/[^\S0-9]/gi, '')) {
    return -1
  } else {
    return 1
  }
})

if (pkg.main) {
  console.log(pkg.main)
  options.push(`<option value="./${pkg.main}">import ${name} from './${pkg.main}' (Raw Source)</option>`)
}

const content = fs.readFileSync('./assets/index.html')
  .toString()
  .replace(/\{\{script\}\}/g, `./${name}.min.js`)
  .replace(/\{\{NAMESPACE\}\}/g, name)
  .replace(/\{\{OPTIONS\}\}/gi, options.join('\n            '))

if (!fs.existsSync(path.resolve('./.testsuite'))) {
  fs.mkdirSync(path.resolve('./.testsuite'), { recursive: true })
}

fs.writeFileSync('./.testsuite/index.html', content)
sources.forEach(jsfile => {
  fs.copyFileSync(`./.browser/${jsfile}`, `./.testsuite/${jsfile}`)
  fs.copyFileSync(`./.browser/${jsfile}.map`, `./.testsuite/${jsfile}.map`)
})

const cwd = process.cwd()
const out = path.join(process.cwd(), '.testsuite')
build.walk('../src').forEach(file => {
  const input = path.resolve(file)
  const output = path.dirname(input).replace(path.join(cwd, '..'), out)
  if (fs.statSync(input).isFile() && !fs.existsSync(output)) {
    fs.mkdirSync(output)
  }

  const content = fs.readFileSync(input)
    .toString()
    .replace(/([\t ]*\/\* ?node-only ?\*\/)[\s\S]*?(\/\* ?end-node-only ?\*\/[\t ]*\n?)/gim, '')
    // .replace(/<#(\s+)?REPLACE_VERSION(\s+)?#>/gi, pkg.version)

  fs.writeFileSync(input.replace(path.join(cwd, '..'), out), content)
})
