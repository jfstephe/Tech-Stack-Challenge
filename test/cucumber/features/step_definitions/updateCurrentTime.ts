import { DisplayTime } from '../../../../src/display-time/display-time'
import * as assert from 'assert'
const { Given, When, Then, After } = require('cucumber')
import * as sinon from 'sinon'
var FakeTimers = require('@sinonjs/fake-timers')

/** ----------------------------
 * ---------STEP--DEFINITIONS---
 * -----------------------------*/

Given('The website has already been loaded', async function () {
  this.countSandbox = sinon.createSandbox()
  this.clock = FakeTimers.install()
  this.displayTime = new DisplayTime()
  this.getSpy = this.countSandbox.spy(this.displayTime, 'fetchCurrentTime')
  await this.displayTime.attached()
})

When('{int} seconds have passed since the initial page load', async function (
  second: number,
) {
  this.clock.tick(second * 1000)
  this.clock.uninstall()
})

Then(
  'The time or the error message should have been updated {int} times',
  function (expectedCount: number) {
    // Count the number of function calls
    assert.strictEqual(this.getSpy.callCount, expectedCount)
  },
)

After(function () {
  if (this.countSandbox) {
    this.countSandbox.restore()
  }
  if (this.displayTime) {
    this.displayTime.detached()
  }
})
