import {post, param, requestBody, HttpErrors} from '@loopback/rest';
import {inject} from '@loopback/core';
import {
  DefaultEventTypes,
  OrchestratorServiceBindings,
  OrchestratorServiceInterface,
} from '../services/types';
import {AnyObject} from '@loopback/repository';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';

export class EventController {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  constructor(
    @inject(OrchestratorServiceBindings.ORCHESTRATOR_SERVICE)
    protected orchestratorService: OrchestratorServiceInterface,
  ) {}

  @post('/events/{eventType}')
  async handleEvent(
    @param.path.string('eventType') eventType: DefaultEventTypes,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            additionalProperties: true,
          },
        },
      },
    })
    body: AnyObject,
  ): Promise<object> {
    try {
      await this.orchestratorService.handleEvent(eventType, body);
      return {success: true};
    } catch (err) {
      if (err instanceof Error) {
        throw HttpErrors.BadRequest(err.message);
      }
      // Log unexpected errors
      this.logger.error(err);
      throw new HttpErrors.InternalServerError('An unexpected error occurred.');
    }
  }
}
