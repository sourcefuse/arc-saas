export class Transaction {
  commit() {
    return Promise.resolve();
  }
  rollback() {
    return Promise.resolve();
  }
  isActive() {
    return Boolean();
  }
  id: '';
}
