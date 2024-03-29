// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import { SubscriptionDbSourceName } from '../../types';

const config = {
  name: 'SubscriptionDB',
  connector: 'memory',
  localStorage: '',
  file: '',
};

export class SubscriptionDataSource extends juggler.DataSource {
  static readonly dataSourceName = 'SubscriptionDB';

  constructor(
    @inject(`datasources.config.SubscriptionDB`, {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
