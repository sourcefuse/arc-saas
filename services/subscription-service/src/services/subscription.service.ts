import moment, {unitOfTime} from 'moment';
import {Subscription} from '../models';
import {repository} from '@loopback/repository';
import {
  BillingCycleRepository,
  PlanRepository,
  SubscriptionRepository,
} from '../repositories';
import {BindingScope, injectable} from '@loopback/context';
import {SubscriptionStatus} from '../enums';
const DATE_FORMAT = 'YYYY-MM-DD';
@injectable({scope: BindingScope.TRANSIENT})
export class SubscriptionService {
  constructor(
    @repository(SubscriptionRepository)
    private readonly subscriptionRepository: SubscriptionRepository,
    @repository(PlanRepository)
    private readonly planRepository: PlanRepository,
    @repository(BillingCycleRepository)
    private readonly billingCycleRepository: BillingCycleRepository,
  ) {}
  async createSubscription(
    subscription: Omit<Subscription, 'id' | 'startDate' | 'endDate'>,
  ): Promise<Subscription> {
    const plan = await this.planRepository.findById(subscription.planId);
    const billingCycle = await this.billingCycleRepository.findById(
      plan.billingCycleId,
    );

    const startDate = moment().format(DATE_FORMAT);
    const endDate = moment()
      .add(billingCycle.duration, this._unitMap(billingCycle.durationUnit))
      .format(DATE_FORMAT);

    return this.subscriptionRepository.create({
      ...subscription,
      startDate,
      endDate,
    });
  }

  private _unitMap(durationUnit: string): unitOfTime.DurationConstructor {
    switch (durationUnit) {
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

  async getExpireSoonSubscriptions(): Promise<
    {id: string; daysRemainingToExpiry: number; subscriberId: string}[]
  > {
    const daysRemaining = 7;
    const subscriptions = await this.subscriptionRepository.find({
      where: {status: SubscriptionStatus.ACTIVE},
    });

    return subscriptions
      .filter(
        sub =>
          moment(sub.endDate).isBefore(moment().add(daysRemaining, 'days')) &&
          moment(sub.endDate).isAfter(moment()),
      )
      .map(sub => ({
        id: sub.id,
        daysRemainingToExpiry: moment(sub.endDate).diff(moment(), 'days'),
        subscriberId: sub.subscriberId,
      }));
  }

  async handleExpiredSubscriptions(
    dayCount: number,
  ): Promise<{subscriptionId: string; subscriberId: string}[]> {
    const subscriptions = await this.subscriptionRepository.find({
      where: {status: SubscriptionStatus.ACTIVE},
    });

    const markAsExpired = subscriptions
      .filter(sub => moment(sub.endDate).isBefore(moment()))
      .map(sub =>
        this.subscriptionRepository.updateById(sub.id, {
          status: SubscriptionStatus.EXPIRED,
        }),
      );
    await Promise.all(markAsExpired);

    const range = moment().subtract(dayCount, 'days').format(DATE_FORMAT);
    const expiredSubscriptions = await this.subscriptionRepository.find({
      where: {status: SubscriptionStatus.EXPIRED},
    });

    return expiredSubscriptions
      .filter(sub => moment(sub.endDate).isAfter(range))
      .map(sub => ({
        subscriptionId: sub.id,
        subscriberId: sub.subscriberId,
      }));
  }
}
