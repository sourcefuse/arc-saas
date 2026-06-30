import {model, Model, property} from '@loopback/repository';

@model({name: 'success_dto'})
export class SuccessDto extends Model {
  @property({type: 'boolean'})
  success: boolean;

  constructor(data?: Partial<SuccessDto>) {
    super(data);
  }
}
