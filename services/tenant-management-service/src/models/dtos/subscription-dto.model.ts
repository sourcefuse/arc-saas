import {model, property} from '@loopback/repository';
import {IPlan, ISubscription} from '../../types';

@model()
export class SubscriptionDTO implements ISubscription {
  @property({type: 'boolean'})
  deleted?: boolean;

  @property({type: 'Date'})
  deletedOn?: Date;

  @property({type: 'string'})
  deletedBy?: string;

  @property({type: 'Date'})
  createdOn?: Date;

  @property({type: 'Date'})
  modifiedOn?: Date;

  @property({type: 'string'})
  createdBy?: string;

  @property({type: 'string'})
  modifiedBy?: string;

  @property({type: 'string'})
  id: string;

  @property({type: 'string'})
  subscriberId: string;

  @property({type: 'string'})
  startDate: string;

  @property({type: 'string'})
  endDate: string;

  @property({type: 'number'})
  status: number;

  @property({type: 'string'})
  planId: string;

  @property({type: 'string'})
  invoiceId: string;

  // Assuming IPlan interface is defined, you can include it here
  @property()
  plan?: IPlan;
}
