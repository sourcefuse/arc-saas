import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {NotificationTemplates} from '../models';
import {NotificationTemplatesRepository} from '../repositories';
import {PermissionKey} from '../permissions';

export class NotificationTemplatesController {
  constructor(
    @repository(NotificationTemplatesRepository)
    private readonly notificationTemplatesRepository: NotificationTemplatesRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewNotificationTemplate]})
  @get(`/notification-templates/{event_name}/{notification_type}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'NotificationTemplates model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(NotificationTemplates),
          },
        },
      },
    },
  })
  async getNotificationTemplates(
    @param.path.string('event_name') eventName: string,
    @param.path.string('notification_type') notificationType: number,
  ): Promise<NotificationTemplates | null> {
    return this.notificationTemplatesRepository.findOne({
      where: {eventName: eventName, notificationType: notificationType},
    });
  }
}
