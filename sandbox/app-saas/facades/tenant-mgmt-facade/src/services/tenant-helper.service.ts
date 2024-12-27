import {BindingScope, inject, injectable, service} from '@loopback/core';
import {CryptoHelperServiceSunnyt} from './crypto-helper-sunny.service';
import moment, {unitOfTime} from 'moment';
import {HttpErrors, RestBindings, Request} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import {
  IBillingCycle,
  SubscriptionProxyService,
  TenantMgmtProxyService,
} from './proxies';
import {
  CreateTenantWithPlanDTO,
  ProvisioningDTO,
  TenantOnboardDTO,
} from '../models';
import {PermissionKey} from '../permissions';
import {InvoiceStatus, NotificationType, SubscriptionStatus} from '../enum';
import {CheckBillingSubscriptionsDTO, SubscriptionDTO} from '../models/dtos';
// import { NotificationService } from './notification.service';
import { json } from 'stream/consumers';
import { ISubscription } from '../types';
import { SubscriptionBillDTO } from '../models/dtos/subscription-bill-dto.model';
import { NotificationService } from './notifications/notification.service';

const DATE_FORMAT = 'YYYY-MM-DD';
const SECONDS_IN_ONE_HOUR = 60 * 60;
@injectable({scope: BindingScope.TRANSIENT})
export class TenantHelperService {
  constructor(
    @service(CryptoHelperServiceSunnyt)
    private readonly cryptoHelperService: CryptoHelperServiceSunnyt,
    @inject('services.SubscriptionProxyService')
    private readonly subscriptionProxyService: SubscriptionProxyService,
    @inject('services.TenantMgmtProxyService')
    private readonly tenantMgmtProxyService: TenantMgmtProxyService,
    @service(NotificationService)
    private notificationService: NotificationService,
    @inject(LOGGER.LOGGER_INJECT)
    private readonly logger: ILogger,
    @inject(RestBindings.Http.REQUEST)
    private readonly request: Request,
  ) {}
  async createTenant(dto: CreateTenantWithPlanDTO) {
    const token = this.request.headers.authorization;
    if (!token) {
      throw new HttpErrors.Unauthorized('Authorization header not present');
    }
    const tenant = await this.tenantMgmtProxyService.createTenant(
      token,
      new TenantOnboardDTO(dto),
    );
    const subscription = await this._createSubscription(dto.planId, tenant.id);
    await this.tenantMgmtProxyService.provisionTenant(
      token,
      tenant.id,
      subscription,
    );
    return tenant;
  }
  async createTenantFromLead(
    token: string,
    id: string,
    dto: Omit<CreateTenantWithPlanDTO, 'contact'>,
  ) {
    const tenant = await this.tenantMgmtProxyService.createTenantFromLead(
      token,
      id,
      new TenantOnboardDTO(dto),
    );

    const subscription = await this._createSubscription(dto.planId, tenant.id);
const sdto:ISubscription={
  id: subscription.id,
  subscriberId: subscription.subscriberId,
  startDate: subscription.startDate,
  endDate: subscription.endDate,
  status: subscription.status,
  planId: subscription.planId,
  plan: subscription.plan,
}
    await this.tenantMgmtProxyService.provisionTenant(
      token,
      tenant.id,
     sdto
    );
    return tenant;
  }


   async getTenantBills(userId:string): Promise<SubscriptionBillDTO[]>{
    const token = this.cryptoHelperService.generateTempToken({
      id: userId,
      userTenantId: userId,
      permissions: [
        PermissionKey.CreateLead
        ,PermissionKey.UpdateLead
        ,PermissionKey.DeleteLead
        ,PermissionKey.ViewLead
        ,PermissionKey.CreateTenant
        ,PermissionKey.ProvisionTenant
        ,PermissionKey.UpdateTenant
        ,PermissionKey.DeleteTenant
        ,PermissionKey.ViewTenant
        ,PermissionKey.CreateContact
        ,PermissionKey.UpdateContact
        ,PermissionKey.DeleteContact
        ,PermissionKey.ViewContact
        ,PermissionKey.CreateInvoice
        ,PermissionKey.UpdateInvoice
        ,PermissionKey.DeleteInvoice
        ,PermissionKey.ViewInvoice
        ,PermissionKey.CreateNotification
        ,PermissionKey.CreateSubscription
        ,PermissionKey.UpdateSubscription
        ,PermissionKey.ViewSubscription
        ,PermissionKey.ViewPlan
        ,PermissionKey.ViewNotificationTemplate
        ,PermissionKey.CreateNotificationTemplate
        ,PermissionKey.UpdateNotificationTemplate
        ,PermissionKey.DeleteNotificationTemplate
      ],
    });

    // const token = this.request.headers.authorization?? "";
    let subscriptionBills:SubscriptionBillDTO[]=[];

    const subscriptions=await this.subscriptionProxyService.find(token,{
      include:['plan']
    });
    for(const subscription of subscriptions){
      const tenant=await this.tenantMgmtProxyService.getTenants(`Bearer ${token}`,{
        where:{id:subscription.subscriberId},
        include:['lead','contacts']
      });
      subscriptionBills.push(new SubscriptionBillDTO({
        companyName:tenant[0].lead?.companyName,
        userName:tenant[0].lead?.firstName+' '+tenant[0].lead?.lastName,
        status:subscription.status,
        startDate:subscription.startDate,
        endDate:subscription.endDate,
        planName:subscription.plan?.name
      }))
    }
    return subscriptionBills;
  }




  private async _createSubscription(planId: string, userId: string) {
    const token = this.cryptoHelperService.generateTempToken({
      id: userId,
      userTenantId: userId,
      permissions: [
        PermissionKey.ViewSubscription,
        PermissionKey.ViewPlan,
        PermissionKey.CreateSubscription,
        PermissionKey.CreateInvoice,
      ],
    });

    const plan = await this.subscriptionProxyService.findPlanById(
      token,
      planId,
      {
        include: ['billingCycle', 'currency'],
      },
    );

    if (!plan.billingCycle) {
      this.logger.error(`Billing cycle info missing for plan: ${planId}`);
      throw new HttpErrors.BadRequest('Invalid Plan');
    }

    if (!plan.currency) {
      this.logger.error(`Currency info missing for plan: ${planId}`);
      throw new HttpErrors.BadRequest('Invalid Plan');
    }

    const startDate = moment().format(DATE_FORMAT);
    const endDate = moment()
      .add(
        plan.billingCycle.duration,
        this._unitMap(plan.billingCycle.durationUnit),
      )
      .format(DATE_FORMAT);

    await this.tenantMgmtProxyService.createInvoice(`Bearer ${token}`, {
      tenantId: userId,
      startDate,
      endDate,
      amount: Number(plan.price),
      currencyCode: plan.currency.currencyCode,
      status: InvoiceStatus.PENDING,
      dueDate: endDate,
    });

    const createdSubscription=await this.subscriptionProxyService.create(token, {
      planId,
      subscriberId: userId,
      status: SubscriptionStatus.ACTIVE,
    });

    return this.subscriptionProxyService.findById(token,createdSubscription.id,
      JSON.stringify({
        include: [
          {
            relation: 'plan',
            scope: {
              include: [{relation: 'planItems'}],
            },
          },
        ],
      }),
    );
  }


  async checkBillingSubscriptions(
    userId: string,
    options?: CheckBillingSubscriptionsDTO,
  ) {
    const daysRemaining = 7;
    // fetch all subscriptions which need to be billed
    const token = this.cryptoHelperService.generateTempToken(
      {
        id: userId,
        userTenantId: userId,
        permissions: [
          PermissionKey.ViewSubscription,
          PermissionKey.ViewPlan,
          PermissionKey.ViewTenant,
          PermissionKey.CreateSubscription,
          PermissionKey.UpdateSubscription,
          PermissionKey.CreateNotification,
          PermissionKey.ViewNotificationTemplate,
        ],
      },
      SECONDS_IN_ONE_HOUR,
    );

    const subscriptions = await this.subscriptionProxyService.find(token, {
      where: {status: SubscriptionStatus.ACTIVE},
    });

    const expiredSubscriptionsArray = [];
    const expiringSoonSubscriptionObj = [];
    const subscriberIdTenantContactMap: {
      [key: string]: {name: string; email: string};
    } = {};

    const markSubscriptionsAsExpiredPromises = [];
    for (const subscription of subscriptions) {
      // check for if subscription is expired
      if (moment(subscription.endDate).isBefore(moment()) ) {
        expiredSubscriptionsArray.push({
          subscriptionId: subscription.id,
          subscriberId: subscription.subscriberId,
        });
        markSubscriptionsAsExpiredPromises.push(
          this.subscriptionProxyService.updateById(token, subscription.id, {
            status: SubscriptionStatus.EXPIRED,
          }),
        );
      }

      // check for if less then 7 days remaining and send notification
      if (
        moment(subscription.endDate).isBefore(
          moment().add(daysRemaining, 'days'),
        ) &&
        moment(subscription.endDate).isAfter(moment())
      ) {
        const daysRemainingToExpiry = moment(subscription.endDate).diff(
          moment(),
          'days',
        );
        expiringSoonSubscriptionObj.push({
          id: subscription.id,
          daysRemainingToExpiry,
          subscriberId: subscription.subscriberId,
        });
      }
    }

    await Promise.all(markSubscriptionsAsExpiredPromises);
    this.logger.info('Subscriptions marked as expired successfully');

    // Fetch all tenants which needs to be notified
    const tenants = await this.tenantMgmtProxyService.getTenants(
      `bearer ${token}`,
      {
        where: {
          id: {
            inq: expiredSubscriptionsArray
              .map(e => e.subscriberId)
              .concat(expiringSoonSubscriptionObj.map(e => e.subscriberId)),
          },
        },
        include: ['contacts'],
      },
    );

    const notificationPromises = [];

    for (const tenant of tenants) {
      subscriberIdTenantContactMap[tenant.id] = {
        name: tenant.contacts[0].firstName,
        email: tenant.contacts[0].email,
      };
    }

    for (const expiredSubscription of expiredSubscriptionsArray) {
      // notificationPromises.push(
      //   this.notificationService
      //     .send(            subscriberIdTenantContactMap[expiredSubscription.subscriberId].email,
      //     NotificationType.SubscriptionExpired,JSON.stringify(          {
      //       name: process.env.APP_NAME,
      //       user: subscriberIdTenantContactMap[
      //         expiredSubscription.subscriberId
      //       ].name,
      //       link: process.env.APP_NAME,
      //     }))
      //     .catch(e => this.logger.error(e)),
      // );
      notificationPromises.push(
        this.notificationService
          .send(
            subscriberIdTenantContactMap[expiredSubscription.subscriberId]
              .email,
            NotificationType.SubscriptionExpired,
            {
              name: process.env.APP_NAME,
              user: subscriberIdTenantContactMap[
                expiredSubscription.subscriberId
              ].name,
              link: process.env.APP_NAME,
            },
            token,
          )
          .catch(e => this.logger.error(e)),
      );
    }

    for (const expiringSoonSubscription of expiringSoonSubscriptionObj) {
      // notificationPromises.push(
      //   this.notificationService
      //     .send(
      //       subscriberIdTenantContactMap[expiringSoonSubscription.subscriberId].email,
      //       NotificationType.SubscriptionEndingSoon,JSON.stringify(
      //         {
      //           name: process.env.APP_NAME,
      //           user: subscriberIdTenantContactMap[
      //             expiringSoonSubscription.subscriberId
      //           ].name,
      //           remainingDays: expiringSoonSubscription.daysRemainingToExpiry,
      //         })
      //     )
      //     .catch(e => this.logger.error(e)),
      // );
      notificationPromises.push(
        this.notificationService
          .send(
            subscriberIdTenantContactMap[expiringSoonSubscription.subscriberId]
              .email,
            NotificationType.SubscriptionEndingSoon,
            {
              name: process.env.APP_NAME,
              user: subscriberIdTenantContactMap[
                expiringSoonSubscription.subscriberId
              ].name,
              remainingDays: expiringSoonSubscription.daysRemainingToExpiry,
            },
            token,
          )
          .catch(e => this.logger.error(e)),
      );
    }

    await Promise.all(notificationPromises);
    this.logger.info('Subscription notifications sent successfully');
  }

  private _unitMap(
    unit: IBillingCycle['durationUnit'],
  ): unitOfTime.DurationConstructor {
    switch (unit) {
      case 'month':
        return 'M';
      case 'year':
        return 'y';
      case 'week':
        return 'week';
      default:
        return 'days';
    }
  }
}
