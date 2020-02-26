/*import { App } from './util';

describe('Util test suite', () => {
    it('should check prime number correctly', () => {
      const result = App();
      expect(result).toBeTruthy();
    });
  });*/
/*const { getScore } = require('./app')

it('should get A', () => {
  const result = getScore()

  // Assertion
  expect(result).toEqual('A')
})*/

const { getScore } = require('./App')

it('should get A', () => {
  const result = getScore()

  // Assertion
  expect(result).toEqual('A')
})
