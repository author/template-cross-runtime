import SimpleCalculator from './lib/calc.js'

const Calc = new SimpleCalculator()

export default class Calculator {
  static add () {
    return Calc.sum(...arguments)
  }

  static avg () {
    return Calc.avg(...arguments)
  }

  static env () {
    Calc.displayEnvironment()
  }
}
