import {Getter, inject} from '@loopback/core';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {DbDataSource} from '../datasources';
import {NotificationTemplates, NotificationTemplatesRelations} from '../models';
import {AuthenticationBindings} from 'loopback4-authentication';
import {NotifDbSourceName} from '@sourceloop/notification-service';

export class NotificationTemplatesRepository extends DefaultUserModifyCrudRepository<
  NotificationTemplates,
  typeof NotificationTemplates.prototype.id,
  NotificationTemplatesRelations
> {
  constructor(
    @inject(`datasources.${NotifDbSourceName}`) dataSource: DbDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
  ) {
    super(NotificationTemplates, dataSource, getCurrentUser);
  }
}
