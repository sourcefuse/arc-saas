import {injectable, BindingScope} from '@loopback/core';
import {IEventConnector} from '../../types/i-event-connector.interface';

@injectable({scope: BindingScope.TRANSIENT})
export class EventConnector implements IEventConnector<unknown> {
  constructor() {}

  publish(event: unknown): Promise<void> {
    throw Error(`${EventConnector.name} not implemented.`);
  }
}
