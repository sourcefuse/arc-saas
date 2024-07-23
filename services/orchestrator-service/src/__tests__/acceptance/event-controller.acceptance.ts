import {expect, givenHttpServerConfig} from '@loopback/testlab';
import {
  OrchestratorServiceBindings,
  OrchestratorServiceInterface,
  DefaultEventTypes,
} from './../../services/types';
import {createRestAppClient, Client} from '@loopback/testlab';
import {RestApplication} from '@loopback/rest';
import {OrchestratorServiceComponent} from '../../component';

describe('EventController (acceptance)', () => {
  let app: RestApplication;
  let client: Client;
  let orchestratorServiceStub: OrchestratorServiceInterface;

  before(givenRunningApplication);
  after(() => app.stop());

  before(givenOrchestratorServiceStub);
  before(() => {
    app
      .bind(OrchestratorServiceBindings.ORCHESTRATOR_SERVICE)
      .to(orchestratorServiceStub);
  });

  before(givenClient);

  it('should successfully handle a valid event', async () => {
    const eventType: DefaultEventTypes = DefaultEventTypes.TENANT_PROVISIONING;
    const eventBody = {tenantId: '123', name: 'John Doe'};

    let calledEventType: DefaultEventTypes | undefined;
    let calledEventBody: unknown;

    orchestratorServiceStub.handleEvent = async (type, body) => {
      calledEventType = type;
      calledEventBody = body;
    };

    const response = await client
      .post(`/events/${eventType}`)
      .send(eventBody)
      .expect(200);

    expect(response.body).to.deepEqual({success: true});
    expect(calledEventType).to.equal(eventType);
    expect(calledEventBody).to.deepEqual(eventBody);
  });

  it('should return 400 for an invalid event', async () => {
    const eventType = 'INVALID_EVENT';
    const eventBody = {someData: 'test'};

    orchestratorServiceStub.handleEvent = async () => {
      throw new Error('Invalid event');
    };

    await client.post(`/events/${eventType}`).send(eventBody).expect(400);
  });

  it('should accept any JSON object as the event body', async () => {
    const eventType: DefaultEventTypes = DefaultEventTypes.TENANT_PROVISIONING;
    const eventBody = {
      field1: 'value1',
      field2: 123,
      nested: {
        subfield: true,
      },
    };

    let calledEventType: DefaultEventTypes | undefined;
    let calledEventBody: unknown;

    orchestratorServiceStub.handleEvent = async (type, body) => {
      calledEventType = type;
      calledEventBody = body;
    };

    const response = await client
      .post(`/events/${eventType}`)
      .send(eventBody)
      .expect(200);

    expect(response.body).to.deepEqual({success: true});
    expect(calledEventType).to.equal(eventType);
    expect(calledEventBody).to.deepEqual(eventBody);
  });

  // Helper functions

  async function givenRunningApplication() {
    const restConfig = givenHttpServerConfig({});
    app = new RestApplication({
      rest: restConfig,
    });
    app.component(OrchestratorServiceComponent);
    await app.start();
  }

  async function givenOrchestratorServiceStub() {
    orchestratorServiceStub = {
      handleEvent: async () => {},
    };
  }

  async function givenClient() {
    client = createRestAppClient(app);
  }
});
