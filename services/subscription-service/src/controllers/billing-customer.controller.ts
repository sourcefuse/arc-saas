import {inject} from '@loopback/core';
import {Filter} from '@loopback/repository';
import {del, get, param, patch, post, requestBody} from '@loopback/rest';
import {
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
  getModelSchemaRefSF,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {BillingCustomer} from '../models/billing-customer.model';
import {CustomerDto} from '../models/dto/customer-dto.model';
import {PermissionKey} from '../permissions';
import {BillingCustomerService} from '../services/billing-customer.service';

const basePath = '/billing-customer';
export class BillingCustomerController {
  /**
   * This TypeScript constructor injects the BillingCustomerService dependency using the @inject
   * decorator.
   * @param {BillingCustomerService} billingCustomerService - The `billingCustomerService` parameter is
   * an instance of the `BillingCustomerService` class that is being injected into the constructor
   * using dependency injection. This allows the class to have access to the functionality provided by
   * the `BillingCustomerService` class within its methods.
   */
  constructor(
    @inject('services.BillingCustomerService')
    private readonly billingCustomerService: BillingCustomerService,
  ) {}

  @authorize({
    permissions: [PermissionKey.CreateBillingCustomer],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'BillingCustomer model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRefSF(CustomerDto, {
              title: 'NewBillingCustomer',
            }),
          },
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRefSF(CustomerDto, {
            title: 'NewCustomer',
            exclude: ['id'],
          }),
        },
      },
    })
    customerDto: Omit<CustomerDto, 'id'>,
    @param.header.string('tenantId') tenantId: string,
  ): Promise<CustomerDto> {
    return this.billingCustomerService.createCustomer(customerDto, tenantId);
  }

  @authorize({
    permissions: [PermissionKey.GetBillingCustomer],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'BillingCustomer model ',
        content: {
          'application/json': {schema: getModelSchemaRefSF(CustomerDto)},
        },
      },
    },
  })
  async getCustomer(
    @param.filter(BillingCustomer) filter?: Filter<BillingCustomer>,
  ): Promise<{customerDetails: CustomerDto; info: BillingCustomer}> {
    return this.billingCustomerService.getCustomer(filter);
  }

  @authorize({
    permissions: [PermissionKey.UpdateBillingCustomer],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(`${basePath}/{tenantId}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'BillingCustomer PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('tenantId') tenantId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRefSF(CustomerDto, {partial: true}),
        },
      },
    })
    customerDto: Partial<CustomerDto>,
  ): Promise<void> {
    return this.billingCustomerService.updateCustomerByTenantId(
      tenantId,
      customerDto,
    );
  }

  @authorize({
    permissions: [PermissionKey.DeleteBillingCustomer],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @del(`${basePath}/{tenantId}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'BillingCustomer DELETE success',
      },
    },
  })
  async deleteById(
    @param.path.string('tenantId') tenantId: string,
  ): Promise<void> {
    return this.billingCustomerService.deleteCustomerByTenantId(tenantId);
  }
}
