import {expect} from '@loopback/testlab';
import {weakEqual} from '../../utils';

describe('weakEqual', () => {
  it('should return true if both values are null', () => {
    expect(weakEqual(null, null)).to.be.true();
  });

  it('should return true if both values are undefined', () => {
    expect(weakEqual(undefined, undefined)).to.be.true();
  });

  it('should return true if both values are equal', () => {
    expect(weakEqual(1, 1)).to.be.true();
  });

  it('should return true if both values are null or undefined', () => {
    expect(weakEqual(null, undefined)).to.be.true();
  });

  it('should return false if both values are different', () => {
    expect(weakEqual(1, undefined)).to.be.false();
  });
});
