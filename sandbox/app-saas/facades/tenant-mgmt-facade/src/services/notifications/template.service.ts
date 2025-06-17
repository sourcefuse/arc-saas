import {BindingScope, injectable, inject} from '@loopback/core';
import {default as handlebars} from 'handlebars';
import {NotificationType} from '../../enum';
import {NotificationProxyService} from '../proxies';

/**
 * Service for handling email templates.
 * This service is responsible for retrieving and compiling email templates.
 * It uses the Handlebars templating engine to compile the templates.
 */
@injectable({scope: BindingScope.SINGLETON})
export class TemplateService {
  constructor(
    @inject('services.NotificationProxyService')
    private notificationProxyService: NotificationProxyService,
  ) {}
  /**
   * The function `getTemplateAndSubject` retrieves a template and subject for a
   * given type and compiles them with the provided parameters.
   * @param {string} type - The `type` parameter is a string that represents the type
   * of email template you want to retrieve.
   * @param {T} params - The `params` parameter is a generic type `T` that represents
   * the data needed to compile the template. It can be any type of data that is
   * required by the template.
   * @returns An object is being returned with two properties: "body" and "subject".
   */
  async getTemplateAndSubject<T>(
    type: NotificationType,
    params: T,
    token: string,
  ) {
    const templateData = await this.notificationProxyService.getTemplateByName(
      type,
      1,
      token,
    );
    const template = templateData.body;
    const subject = templateData.subject;
    return {
      body: this._compileTemplate(template, params),
      subject: this._compileTemplate(subject, params),
    };
  }

  /**
   * The function compiles a Handlebars template with given parameters and returns the compiled template.
   * @param {string} template - A string representing a Handlebars template. This template can contain
   * placeholders or variables that will be replaced with actual values when the template is compiled.
   * @param {T} params - The `params` parameter is a generic type `T` that represents the data object
   * used to populate the template. It can be any type of object that contains the necessary properties
   * and values required by the template.
   * @returns The compiled template with the provided parameters.
   */
  private _compileTemplate<T>(template: string, params: T) {
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate(params);
  }
}
