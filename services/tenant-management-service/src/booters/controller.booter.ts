import {ArtifactOptions, BaseArtifactBooter} from '@loopback/boot';
import {
  BindingScope,
  config,
  CoreBindings,
  inject,
  injectable,
} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import path from 'path';

@injectable({scope: BindingScope.SINGLETON})
export class TenantMgmtControllerBooter extends BaseArtifactBooter {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    protected application: RestApplication,
    @inject('paths.base', {optional: true})
    protected basePath: string = path.resolve(__dirname, '..'),
    @config()
    public controllerConfig: ArtifactOptions = {},
  ) {
    super(
      basePath,
      // Set Controller Booter Options if passed in via bootConfig
      Object.assign({}, ControllerDefaults, controllerConfig),
    );
  }

  async load(): Promise<void> {
    await super.load();
    this.classes.forEach(cls => {
      this.application.controller(cls);
    });
  }
}

/**
 * Default ArtifactOptions for ControllerBooter.
 */
export const ControllerDefaults: ArtifactOptions = {
  dirs: ['controllers'],
  extensions: ['.controller.js'],
  nested: true,
};
