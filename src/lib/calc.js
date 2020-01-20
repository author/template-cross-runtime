export default class Calculator {
  displayEnvironment () {
    /* node-only */
    process.stdout.write('Node.js')
    /* end-node-only */
    /* browser-only */
    console.log('Browser')
    /* end-browser-only */
  }

  sum () {
    let total = 0
    Array.from(arguments).forEach(number => total += number)
    return total
  }

  avg () {
    return this.sum(...arguments)/arguments.length
  }
}
