import {model, Model, property} from '@loopback/repository';

@model({name: 'product_dto'})
export class ProductDto extends Model {
  @property({type: 'string', name: 'id'})
  id?: string;

  @property({type: 'string', name: 'name'})
  name: string;

  @property({type: 'string', name: 'description'})
  description?: string;

  @property({type: 'object', name: 'metadata'})
  metadata?: object;

  constructor(data?: Partial<ProductDto>) {
    super(data);
  }
}
