import {
  BindingScope,
  config,
  CoreBindings,
  inject,
  injectable,
} from '@loopback/core';
import {TenantMgmtControllerBooter} from '../controller.booter';
import {ArtifactOptions} from '@loopback/boot';
import {RestApplication} from '@loopback/rest';
import path from 'path';

@injectable({scope: BindingScope.SINGLETON})
export class WebhookControllerBooter extends TenantMgmtControllerBooter {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    application: RestApplication,
    @inject('paths.base', {optional: true})
    basePath: string = path.resolve(__dirname, '..'),
    @config()
    controllerConfig: ArtifactOptions = {},
  ) {
    super(
      application,
      basePath,
      Object.assign({}, WebhookControllerDefaults, controllerConfig),
    );
  }
}

/**
 * Default ArtifactOptions for ControllerBooter.
 */
export const WebhookControllerDefaults: ArtifactOptions = {
  dirs: ['controllers/webhook'],
  extensions: ['.controller.js'],
  nested: true,
};
