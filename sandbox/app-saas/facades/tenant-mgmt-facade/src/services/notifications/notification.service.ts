import {BindingScope, inject, injectable, service} from '@loopback/core';
import {TemplateService} from './template.service';
import {NotificationProxyService} from '../proxies';
import {NotificationType} from '../../enum';

/**
 * Service for handling notifications.
 * This service is responsible for sending notifications using the NotificationProxyService.
 * It uses the TemplateService to retrieve and compile the notification templates.
 */
@injectable({scope: BindingScope.SINGLETON})
export class NotificationService {
  /**
   * Constructs a new instance of the NotificationService.
   * @param {TemplateService} templateService - Service for handling templates.
   * @param {NotificationProxyService} notificationProxyService - Service for sending notifications.
   */
  constructor(
    @service(TemplateService)
    public templateService: TemplateService,
    @inject('services.NotificationProxyService')
    public notificationProxyService: NotificationProxyService,
  ) {}
  /**
   * The `send` function sends an email notification with a given email address,
   * notification type, data, and authentication token.
   * @param {string} email - The email address of the recipient.
   * @param {string} type - The `type` parameter is a string that represents the type
   * of email being sent. It is used to determine which template and subject to use
   * for the email.
   * @param {T} data - The `data` parameter is a generic type `T` which represents
   * the data that will be used to populate the email template. It can be any type of
   * data, depending on the specific use case.
   * @param {string} token - A string representing the authentication token for the
   * user sending the email.
   * @returns the result of the createNotification api call.
   */
  async send<T>(email: string, type: NotificationType, data: T, token: string) {
    const {body, subject} = await this.templateService.getTemplateAndSubject(
      type,
      data,
      token,
    );
    const notification = {
      subject,
      body,
      receiver: {
        to: [
          {
            id: email,
          },
        ],
      },
      type: 1,
      sentDate: new Date(),
      options: {
        from: process.env.FROM_EMAIL,
        html: body,
      },
    };

    return this.notificationProxyService.createNotification(
      token,
      notification,
    );
  }
}
