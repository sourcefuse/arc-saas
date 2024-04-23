import {Model, model, property} from '@loopback/repository';

@model({
  description:
    'model describing payload used to provision resources for a tenant',
})
export class ProvisioningDTO extends Model {
  @property({
    type: 'string',
  })
  subscriptionId?: string;

  @property({
    type: 'string',
  })
  chargeId?: string;

  constructor(data?: Partial<ProvisioningDTO>) {
    super(data);
  }
}
