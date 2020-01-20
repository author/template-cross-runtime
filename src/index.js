import Logger from './lib/demo.js'

const Example = () => {
  const demologger = new Logger()
  demologger.log('hello', 'world')
}

export { Example as default }
