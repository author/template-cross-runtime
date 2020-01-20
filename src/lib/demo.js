export default class GenericLog {
  get date () {
    return new Date().toLocaleTimeString()
  }

  log () {
    for (const out of arguments) {
      /* node-only */
      process.stdout.write(`${this.date}> ${out}\n`)
      /* end-node-only */
      /* browser-only */
      console.log(`${this.date}> ${out}`)
      /* end-browser-only */
    }
  }
}
