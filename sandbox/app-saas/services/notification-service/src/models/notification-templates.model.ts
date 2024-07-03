import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

@model({
  name: 'notification_templates',
})
export class NotificationTemplates extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    name: 'event_name',
    type: 'string',
    required: true,
  })
  eventName: string;

  @property({
    type: 'string',
    required: true,
  })
  body: string;

  @property({
    name: 'notification_type',
    type: 'number',
    required: true,
  })
  notificationType: number;

  @property({
    type: 'string',
  })
  subject: string;

  constructor(data?: Partial<NotificationTemplates>) {
    super(data);
  }
}

export interface NotificationTemplatesRelations {}
export type NotificationTemplatesWithRelations = NotificationTemplates;
