import {BootBindings, Booter} from '@loopback/boot';
import {
  BindingScope,
  Component,
  Context,
  inject,
  injectable,
  MetadataInspector,
} from '@loopback/core';
import {OVERRIDE_MODEL_SCHEMA_KEY} from '@sourceloop/core';

@injectable({scope: BindingScope.SINGLETON})
export class TenantMgmtModelBooter implements Booter {
  constructor(
    @inject(BootBindings.PROJECT_ROOT)
    protected readonly projectRoot: string,
    @inject.context()
    protected readonly context: Context,
  ) {}

  /**
   * Must be implemented by child class to provide:
   * - The component binding key (e.g. 'components.MyComponent')
   */
  protected readonly component: string = 'TenantManagementServiceComponent';

  async load(): Promise<void> {
    const componentInstance = this.context.getSync<Component>(
      `components.${this.component}`,
    );
    const models = componentInstance?.models;

    if (models && Array.isArray(models)) {
      for (const model of models) {
        const newModel = this.context.getSync<Function>('models.' + model.name);
        MetadataInspector.defineMetadata(
          OVERRIDE_MODEL_SCHEMA_KEY,
          newModel,
          model,
        );
      }
    }
  }
}
