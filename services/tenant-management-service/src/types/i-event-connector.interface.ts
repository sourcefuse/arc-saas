export interface IEventConnector<T> {
  publish(event: T): Promise<void>;
}
