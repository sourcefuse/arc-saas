import {Provider, ValueOrPromise} from '@loopback/core';
import {IAuthUser} from 'loopback4-authorization';
import {AnyObject} from '@loopback/repository';
export class SystemUserProvider implements Provider<IAuthUser & AnyObject> {
  value(): ValueOrPromise<IAuthUser & AnyObject> {
    return {
      username: 'SYSTEM',
      id: process.env.SYSTEM_USER_ID!,
      userTenantId: process.env.SYSTEM_USER_ID!,
      permissions: [],
    };
  }
}
