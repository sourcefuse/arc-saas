import {model, property, belongsTo, AnyObject} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {Tenant} from './tenant.model';

@model({
  name: 'tenant_mgmt_configs',
  description:
    'tenant_mgmt_configs to save any tenant specific data related to idP',
})
export class TenantMgmtConfig extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    name: 'config_key',
  })
  configKey: string;

  @property({
    type: 'object',
    required: true,
    name: 'config_value',
  })
  configValue: AnyObject;

  @belongsTo(
    () => Tenant,
    {keyTo: 'id'},
    {
      type: 'string',
      name: 'tenant_id',
      description: 'id of the tenant this invoice is generated for',
      required: true,
    },
  )
  tenantId: string;

  constructor(data?: Partial<TenantMgmtConfig>) {
    super(data);
  }
}
