import {Booter, BootBindings} from '@loopback/boot';
import {
  BindingScope,
  ControllerClass,
  CoreBindings,
  inject,
  injectable,
} from '@loopback/core';
import {RestApplication} from '@loopback/rest';

@injectable({scope: BindingScope.SINGLETON})
export class TenantMgmtControllerBooter implements Booter {
  constructor(
    @inject(BootBindings.PROJECT_ROOT) private readonly projectRoot: string,
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private application: RestApplication,
  ) {}
  protected readonly controllerModules = [
    '../controllers/tenant.controller',
    '../controllers/contact.controller',
    '../controllers/home-page.controller',
    '../controllers/lead.controller',
    '../controllers/lead-tenant.controller',
    '../controllers/tenant-mgmt-config.controller',
    '../controllers/tenant-mgmt-config-tenant.controller',
    '../controllers/ping.controller',
    '../controllers/invoice.controller',
  ];

  async load(): Promise<void> {
    for (const module of this.controllerModules) {
      const controller = require(module);
      // Handle default export if it exists
      if (controller.default && typeof controller.default === 'function') {
        this.bindController(controller.default);
      }

      // Handle named exports
      for (const key in controller) {
        if (key === 'default') continue; // Already handled
        const controllerClass = controller[key];
        if (typeof controllerClass === 'function') {
          this.bindController(controllerClass);
        }
      }
    }
  }

  private bindController(controllerClass: ControllerClass<unknown>) {
    const bindingKey = `controllers.${controllerClass.name}`;
    if (!this.application.isBound(bindingKey)) {
      console.log(`Binding controller: ${controllerClass.name}`);
      this.application.controller(controllerClass);
    } else {
      console.log(
        `Controller ${controllerClass.name} is already bound, skipping...`,
      );
    }
  }
}
