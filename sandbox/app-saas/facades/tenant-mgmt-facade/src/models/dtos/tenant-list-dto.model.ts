import {model, property} from '@loopback/repository';

@model({
  description: 'model describing payload used to create a lead',
})
export class TenantListDTO {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    description: 'name of the lead',
  })
  name?: string;

  @property({
    name: 'company_name',
    type: 'string',
    description: `name of the lead's company`,
  })
  companyName?: string;

  @property({
    type: 'string',
    description: 'email of the lead',
  })
  email?: string;

  @property({
    type: 'string',
    description: 'email domains',
  })
  domains?: string;
}
