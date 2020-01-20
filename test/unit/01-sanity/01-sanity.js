import 'source-map-support/register.js'
import test from 'tape'
import demo from '../../.node/index.js'

test('Sanity Checks', t => {
  t.pass('Template tests are available.')
  t.ok(demo !== undefined, 'Library is instantiated.')
  demo()
  t.end()
})