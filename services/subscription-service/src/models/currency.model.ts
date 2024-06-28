import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'currencies',
})
export class Currency extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    name: 'currency_code',
  })
  currencyCode: string;

  @property({
    type: 'string',
    required: true,
    name: 'currency_name',
  })
  currencyName: string;

  @property({
    type: 'string',
    name: 'symbol',
  })
  symbol?: string;

  @property({
    type: 'string',
    name: 'country',
  })
  country?: string;

  constructor(data?: Partial<Currency>) {
    super(data);
  }
}
