import {sign} from 'jsonwebtoken';
import {BindingScope, injectable} from '@loopback/core';
import {Lead, Tenant} from '../models';
import {createHmac, randomBytes} from 'crypto';
import {FIVE_SECONDS} from '../utils';
@injectable({scope: BindingScope.SINGLETON})
export class CryptoHelperService {
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
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error(
        'JWT_SECRET is not defined in the environment variables.',
      );
    }
    //sonarignore:start
    return sign(payload, secret, {
      //sonarignore:end
      issuer: process.env.JWT_ISSUER,
      algorithm: 'HS256',
      expiresIn: expiry ?? FIVE_SECONDS,
    });
  }

  /**
   * The function generates a temporary token for a lead with optional permissions and a specified expiry
   * time.
   * @param {Lead} lead - The `lead` parameter is an object that represents a lead. It likely contains
   * properties such as `id` and `userTenantId` that are used to generate the temporary token.
   * @param {string[]} permissions - The `permissions` parameter is an optional array of strings that
   * represents the permissions associated with the lead. It allows you to specify any additional
   * permissions that should be included in the generated temporary token for the lead.
   * @returns the result of calling the `generateTempToken` function with two arguments: an object and a
   * number.
   */
  generateTempTokenForLead(lead: Lead, permissions: string[] = []) {
    return this.generateTempToken(
      {
        id: lead.id,
        userTenantId: lead.id,
        permissions,
      },
      +process.env.LEAD_TOKEN_EXPIRY!,
    );
  }

  /**
   * The function generates a temporary token for a given tenant with optional permissions.
   * @param {Tenant} tenant - The `tenant` parameter is an object that represents a tenant. It likely
   * contains properties such as `id`, `name`, and other relevant information about the tenant.
   * @param {string[]} permissions - An optional array of strings representing the permissions that the
   * generated token should have.
   * @returns the result of calling the `generateTempToken` function with an object as its argument.
   */
  generateTempTokenForTenant(tenant: Tenant, permissions: string[] = []) {
    return this.generateTempToken({
      id: tenant.id,
      userTenantId: tenant.id,
      permissions,
    });
  }

  /**
   * The function generates an HMAC for webhook verification using a payload, timestamp, and secret.
   * @param {string} payload - The payload is a string that contains the data that needs to be verified.
   * It could be any information that is being sent in the webhook request, such as user details or
   * transaction information.
   * @param {number} timestamp - The timestamp parameter is a number representing the current time in
   * milliseconds. It is used to ensure the uniqueness and freshness of the payload.
   * @param {string} secret - The `secret` parameter is a string that is used as a secret key for
   * generating the HMAC. It is a shared secret between the sender and receiver of the webhook.
   * @returns the HMAC (Hash-based Message Authentication Code) generated using the payload, timestamp,
   * and secret.
   */
  generateHmacForWebhookVerification(
    payload: string,
    timestamp: number,
    secret: string,
  ) {
    return createHmac('sha256', secret)
      .update(`${payload}${timestamp}`)
      .digest('hex');
  }

  /**
   * The function generates a random string of a specified length using random bytes.
   * @param {number} length - The length parameter is a number that specifies the desired length of the
   * random string to be generated.
   * @returns a randomly generated string of hexadecimal characters.
   */
  generateRandomString(length: number) {
    // divided by two as the result is twice the length given
    return randomBytes(length / 2).toString('hex');
  }
}
