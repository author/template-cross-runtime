import fs from 'fs'
import path from 'path'

fs
  .readdirSync(path.resolve('./'))
  .forEach(filepath => {
    const fullpath = path.resolve(filepath)
    if (filepath.startsWith('.') && filepath !== '.git' && filepath !== '.github' && fs.statSync(fullpath).isDirectory()) {
      fs.rmdirSync(filepath, { recursive: true })
      console.log(`Removed ${fullpath}`)
    }
  })