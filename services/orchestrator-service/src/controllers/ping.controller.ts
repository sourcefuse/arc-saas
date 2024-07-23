import {inject} from '@loopback/core';
import {Request, RestBindings, get} from '@loopback/rest';

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private readonly req: Request,
  ) {}

  @get('/ping')
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from Orchestrator Service.',
      date: new Date(),
      url: this.req.url,
      headers: {...this.req.headers},
    };
  }
}
