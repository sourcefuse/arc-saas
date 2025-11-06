import {injectable, BindingScope} from '@loopback/core';
import {IEventConnector} from '../../types/i-event-connector.interface';
import {Producer, producer, QueueType} from 'loopback4-message-bus-connector';

@injectable({scope: BindingScope.TRANSIENT})
export class EventConnector implements IEventConnector<unknown> {
  constructor(
    /**
     * Injects a message bus producer for publishing events.
     *
     * The `@producer()` decorator allows selecting which underlying
     * message bus strategy to use. Supported strategies include:
     *
     * - `QueueType.EventBridge` → Publishes events to AWS EventBridge.
     * - `QueueType.BullMQ` → Publishes events to Redis-based BullMQ queues.
     * - `QueueType.SQS` → Publishes events to AWS SQS queues.
     *
     * If you want to use EventBridge strategy, define your producer as shown below.
     */
    @producer(QueueType.EventBridge)
    private eventBridgeProducer: Producer,
  ) {}

  publish(event: unknown): Promise<void> {
    throw Error(`${EventConnector.name} not implemented.`);
  }
}
