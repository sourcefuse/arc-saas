import {model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class PriceDto {
  @property({type: 'string'})
  id?: string;

  @property({type: 'string'})
  currency: string;

  @property({type: 'number'})
  unitAmount: number;

  @property({type: 'string'})
  product: string;

  @property({type: 'boolean'})
  active?: boolean;

  @property({type: 'object'})
  recurring?: {
    interval?: string;
    intervalCount?: number;
  };

  @property({type: 'object'})
  metadata?: object;

  constructor(data?: Partial<PriceDto>) {
    Object.assign(this, data);
  }
}

export type PriceDtoWithRelations = PriceDto;
