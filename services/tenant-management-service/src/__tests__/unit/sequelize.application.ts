// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import * as path from 'path';
import {TenantManagementServiceComponent} from '../../component';
import {WebhookTenantManagementServiceComponent} from '../../webhook.component';
import {TenantManagementServiceBindings} from '../../keys';

export {ApplicationConfig};

export class TenantMgmtServiceApplication extends BootMixin(
  RepositoryMixin(RestApplication),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.static('/', path.join(__dirname, '../public'));
    this.bind(TenantManagementServiceBindings.Config).to({
      useCustomSequence: false,
      useSequelize: true,
    });
    this.component(TenantManagementServiceComponent);
    this.component(WebhookTenantManagementServiceComponent);
    this.projectRoot = __dirname;
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
