import {BindingScope, injectable} from '@loopback/context';
import {sign} from 'jsonwebtoken';
const FIVE = 5;
@injectable({scope: BindingScope.SINGLETON})
export class CryptoHelperServiceSunnyt {
  /**
   * The function generates a temporary token using a payload and an optional expiry time.
   * @param {T} payload - The `payload` parameter is an object that contains the data you want to include
   * in the token. This data can be any valid JSON object.
   * @param {number} [expiry] - The `expiry` parameter is an optional parameter that specifies the
   * expiration time for the generated token. It is a number that represents the duration in seconds
   * after which the token will expire. If no value is provided for `expiry`, the token will expire after
   * 5 seconds.
   * @returns a signed JWT token.
   */
  generateTempToken<T extends object>(payload: T, expiry?: number) {
    return sign(payload, process.env.JWT_SECRET!, {
      issuer: process.env.JWT_ISSUER,
      algorithm: 'HS256',
      expiresIn: expiry ?? FIVE,
    });
  }
}
