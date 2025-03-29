// import sinon from 'sinon';
// import {CryptoHelperService, TenantHelperService} from '../../services';
// import {
//   SubscriptionProxyService,
//   TenantMgmtProxyService,
// } from '../../services/proxies';
// import {ILogger} from '@sourceloop/core';
// import {ProvisioningDTO, TenantOnboardDTO} from '../../models';
// import {expect} from '@loopback/testlab';
// import moment from 'moment';
// import {SubscriptionStatus} from '../../enum';
// import {HttpErrors, Request} from '@loopback/rest';
// import {fail} from 'assert';
// import {
//   buildCreateTenantDto,
//   buildPlan,
//   buildSubscription,
//   buildTenant,
//   dateFormat,
//   mockLeadId,
//   mockToken,
// } from '../mock-data';

// describe('TenantHelperService', () => {
//   let tenantHelperService: TenantHelperService;
//   let tenantMgmtProxyService: sinon.SinonStubbedInstance<TenantMgmtProxyService>;
//   let subscriptionProxyService: sinon.SinonStubbedInstance<SubscriptionProxyService>;
//   let logger: sinon.SinonStubbedInstance<ILogger>;
//   let cryptoHelper: CryptoHelperService;
//   let request: Request;

//   beforeEach(() => {
//     tenantMgmtProxyService = {
//       createInvoice: sinon.stub(),
//       createLead: sinon.stub(),
//       createTenant: sinon.stub(),
//       createTenantFromLead: sinon.stub(),
//       provisionTenant: sinon.stub(),
//       verifyLead: sinon.stub(),
//       getLeads: sinon.stub(),
//       getTenants: sinon.stub(),
//     };

//     logger = {
//       error: sinon.stub(),
//       info: sinon.stub(),
//       log: sinon.stub(),
//       warn: sinon.stub(),
//       debug: sinon.stub(),
//     };

//     subscriptionProxyService = {
//       create: sinon.stub(),
//       findById: sinon.stub(),
//       findPlanById: sinon.stub(),
//       updateById: sinon.stub(),
//       find: sinon.stub(),
//     };

//     cryptoHelper = new CryptoHelperService();
//     request = {headers: {authorization: mockToken}} as unknown as Request;
//     tenantHelperService = new TenantHelperService(
//       cryptoHelper,
//       subscriptionProxyService,
//       tenantMgmtProxyService,
//       notificationService,
//       logger,
//       request,
//     );
//   });

//   describe('createTenantFromLead', () => {
//     it('should create a tenant from a lead and a subscription with duration of a month', async () => {
//       const dto = buildCreateTenantDto();
//       const tenant = buildTenant();
//       const subscription = buildSubscription();
//       const plan = buildPlan('month');

//       tenantMgmtProxyService.createTenantFromLead.resolves(tenant);
//       subscriptionProxyService.create.resolves(subscription);
//       subscriptionProxyService.findPlanById.resolves(plan);
//       tenantMgmtProxyService.provisionTenant.resolves();

//       const result = await tenantHelperService.createTenantFromLead(
//         mockToken,
//         mockLeadId,
//         dto,
//       );

//       expect(result).to.equal(tenant);
//       sinon.assert.calledWith(
//         tenantMgmtProxyService.createTenantFromLead,
//         mockToken,
//         mockLeadId,
//         new TenantOnboardDTO(dto),
//       );
//       sinon.assert.calledOnce(subscriptionProxyService.create);
//       const secondArg = subscriptionProxyService.create.getCall(0).args[1];
//       expect(secondArg).to.eql({
//         planId: dto.planId,
//         subscriberId: tenant.id,
//         startDate: moment().format(dateFormat),
//         endDate: moment().add(1, 'month').format(dateFormat),
//         status: SubscriptionStatus.ACTIVE,
//       });
//       sinon.assert.calledWith(
//         tenantMgmtProxyService.provisionTenant,
//         mockToken,
//         tenant.id,
//         new ProvisioningDTO({subscriptionId: subscription.id}),
//       );
//     });

//     it('should create a tenant from a lead and a subscription with duration of a year', async () => {
//       const dto = buildCreateTenantDto();
//       const tenant = buildTenant();
//       const subscription = buildSubscription();
//       const plan = buildPlan('year');

//       tenantMgmtProxyService.createTenantFromLead.resolves(tenant);
//       subscriptionProxyService.create.resolves(subscription);
//       subscriptionProxyService.findPlanById.resolves(plan);
//       tenantMgmtProxyService.provisionTenant.resolves();

//       const result = await tenantHelperService.createTenantFromLead(
//         mockToken,
//         mockLeadId,
//         dto,
//       );

//       expect(result).to.equal(tenant);
//       sinon.assert.calledWith(
//         tenantMgmtProxyService.createTenantFromLead,
//         mockToken,
//         mockLeadId,
//         new TenantOnboardDTO(dto),
//       );
//       sinon.assert.calledOnce(subscriptionProxyService.create);
//       const secondArg = subscriptionProxyService.create.getCall(0).args[1];
//       expect(secondArg).to.eql({
//         planId: dto.planId,
//         subscriberId: tenant.id,
//         startDate: moment().format(dateFormat),
//         endDate: moment().add(1, 'year').format(dateFormat),
//         status: SubscriptionStatus.ACTIVE,
//       });
//       sinon.assert.calledWith(
//         tenantMgmtProxyService.provisionTenant,
//         mockToken,
//         tenant.id,
//         new ProvisioningDTO({subscriptionId: subscription.id}),
//       );
//     });

//     it('should create a tenant from a lead and a subscription with a duration of a week', async () => {
//       const dto = buildCreateTenantDto();
//       const tenant = buildTenant();
//       const subscription = buildSubscription();
//       const plan = buildPlan('week');

//       tenantMgmtProxyService.createTenantFromLead.resolves(tenant);
//       subscriptionProxyService.create.resolves(subscription);
//       subscriptionProxyService.findPlanById.resolves(plan);
//       tenantMgmtProxyService.provisionTenant.resolves();

//       const result = await tenantHelperService.createTenantFromLead(
//         mockToken,
//         mockLeadId,
//         dto,
//       );

//       expect(result).to.equal(tenant);
//       sinon.assert.calledWith(
//         tenantMgmtProxyService.createTenantFromLead,
//         mockToken,
//         mockLeadId,
//         new TenantOnboardDTO(dto),
//       );
//       sinon.assert.calledOnce(subscriptionProxyService.create);
//       const secondArg = subscriptionProxyService.create.getCall(0).args[1];
//       expect(secondArg).to.eql({
//         planId: dto.planId,
//         subscriberId: tenant.id,
//         startDate: moment().format(dateFormat),
//         endDate: moment().add(1, 'week').format(dateFormat),
//         status: SubscriptionStatus.ACTIVE,
//       });
//       sinon.assert.calledWith(
//         tenantMgmtProxyService.provisionTenant,
//         mockToken,
//         tenant.id,
//         new ProvisioningDTO({subscriptionId: subscription.id}),
//       );
//     });

//     it('should create a tenant from without a lead and with a subscription with some unknown duration unit', async () => {
//       const dto = buildCreateTenantDto();
//       const tenant = buildTenant();
//       const subscription = buildSubscription();
//       const plan = buildPlan('what');

//       tenantMgmtProxyService.createTenant.resolves(tenant);
//       subscriptionProxyService.create.resolves(subscription);
//       subscriptionProxyService.findPlanById.resolves(plan);
//       tenantMgmtProxyService.provisionTenant.resolves();

//       const result = await tenantHelperService.createTenant(dto);

//       expect(result).to.equal(tenant);
//       sinon.assert.calledWith(
//         tenantMgmtProxyService.createTenant,
//         mockToken,
//         new TenantOnboardDTO(dto),
//       );
//       sinon.assert.calledOnce(subscriptionProxyService.create);
//       const secondArg = subscriptionProxyService.create.getCall(0).args[1];
//       expect(secondArg).to.eql({
//         planId: dto.planId,
//         subscriberId: tenant.id,
//         startDate: moment().format(dateFormat),
//         // in this case unit falls back to days
//         endDate: moment().add(1, 'days').format(dateFormat),
//         status: SubscriptionStatus.ACTIVE,
//       });
//       sinon.assert.calledWith(
//         tenantMgmtProxyService.provisionTenant,
//         mockToken,
//         tenant.id,
//         new ProvisioningDTO({subscriptionId: subscription.id}),
//       );
//     });

//     it('should throw 401 if token is missing in request', async () => {
//       tenantHelperService = new TenantHelperService(
//         cryptoHelper,
//         subscriptionProxyService,
//         tenantMgmtProxyService,
//         notificationService,
//         logger,
//         {headers: {authorization: ''}} as unknown as Request,
//       );
//       const dto = buildCreateTenantDto();
//       const tenant = buildTenant();
//       const subscription = buildSubscription();
//       const plan = buildPlan();

//       tenantMgmtProxyService.createTenant.resolves(tenant);
//       subscriptionProxyService.create.resolves(subscription);
//       subscriptionProxyService.findPlanById.resolves(plan);
//       tenantMgmtProxyService.provisionTenant.resolves();

//       try {
//         await tenantHelperService.createTenant(dto);
//         fail();
//       } catch (error) {
//         expect(error).to.eql(
//           new HttpErrors.Unauthorized('Authorization header not present'),
//         );
//       }
//     });

//     it('should throw 400 if billingCycle info is missing in selected plan', async () => {
//       const dto = buildCreateTenantDto();
//       const tenant = buildTenant();
//       const subscription = buildSubscription();
//       const plan = buildPlan();

//       tenantMgmtProxyService.createTenant.resolves(tenant);
//       subscriptionProxyService.create.resolves(subscription);
//       subscriptionProxyService.findPlanById.resolves({
//         ...plan,
//         billingCycle: undefined,
//       });
//       tenantMgmtProxyService.provisionTenant.resolves();

//       try {
//         await tenantHelperService.createTenant(dto);
//         fail();
//       } catch (error) {
//         expect(error).to.eql(new HttpErrors.BadRequest('Invalid Plan'));
//       }
//     });

//     it('should throw 400 if currency info is missing in selected plan', async () => {
//       const dto = buildCreateTenantDto();
//       const tenant = buildTenant();
//       const subscription = buildSubscription();
//       const plan = buildPlan();

//       tenantMgmtProxyService.createTenant.resolves(tenant);
//       subscriptionProxyService.create.resolves(subscription);
//       subscriptionProxyService.findPlanById.resolves({
//         ...plan,
//         currency: undefined,
//       });
//       tenantMgmtProxyService.provisionTenant.resolves();

//       try {
//         await tenantHelperService.createTenant(dto);
//         fail();
//       } catch (error) {
//         expect(error).to.eql(new HttpErrors.BadRequest('Invalid Plan'));
//       }
//     });
//   });
// });
