import {BindingScope, inject, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import {TenantStatus} from '../enums';
import {Address, Contact, Lead, Tenant, TenantOnboardDTO} from '../models';
import {CreateLeadDTO} from '../models/dtos/create-lead-dto.model';
import {
  AddressRepository,
  ContactRepository,
  LeadRepository,
  TenantRepository,
} from '../repositories';
import {LeadUser} from '../types';
import {hasAnyOf, weakEqual} from '../utils';
import {LeadAuthenticator} from './lead-authenticator.service';

/**
 * Helper service for onboarding tenants.
 */
@injectable({scope: BindingScope.REQUEST})
export class OnboardingService {
  /**
   * Constructs a new instance of the OnboardingService.
   * @param {LeadRepository} leadRepository - Repository for managing leads.
   * @param {TenantRepository} tenantRepository - Repository for managing tenants.
   * @param {ContactRepository} contactRepository - Repository for managing contacts.
   * @param {AddressRepository} addressRepository - Repository for managing addresses.
   * @param {LeadAuthenticator} leadAuthenticator - Service for authenticating leads.
   * @param {ILogger} logger - Logger service for logging messages.
   */
  constructor(
    @repository(LeadRepository)
    private leadRepository: LeadRepository,
    @repository(TenantRepository)
    private tenantRepository: TenantRepository,
    @repository(ContactRepository)
    private contactRepository: ContactRepository,
    @repository(AddressRepository)
    private addressRepository: AddressRepository,
    @service(LeadAuthenticator)
    private leadAuthenticator: LeadAuthenticator,
    @inject(LOGGER.LOGGER_INJECT)
    private logger: ILogger,
  ) {}
  /**
   * The addLead function creates a new lead, triggers a validation email, and
   * returns the new lead.
   * @param lead - The `lead` parameter is an object of type `Lead` with the `id`
   * property omitted.
   * @returns The `addLead` function is returning the newly created lead object.
   */
  async addLead(lead: Omit<CreateLeadDTO, 'isValidated' | 'addressId' | 'id'>) {
    const existing = await this.leadRepository.findOne({
      where: {
        email: lead.email,
        isValidated: true,
      },
    });
    if (existing) {
      this.logger.error(`Lead with email ${lead.email} already exists`);
      throw new HttpErrors.Conflict();
    }
    let addressId: string | undefined = undefined;
    if (lead.address?.country) {
      const address = await this.addressRepository.create(
        new Address({
          country: lead.address?.country,
          address: lead.address?.address,
          city: lead.address?.city,
          state: lead.address?.state,
          zip: lead.address?.zip,
        }),
      );
      addressId = address.id;
    }
    const newLead = await this.leadRepository.create(
      new Lead({
        companyName: lead.companyName,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        communicationEmail: lead.communicationEmail,
        isValidated: false,
        addressId,
      }),
    );
    const key = await this.leadAuthenticator.triggerValidationMail(newLead); // triggered notification sunny
    return {key, id: newLead.id};
  }

  /**
   * The startOnboarding function checks if a lead user exists and is validated, and
   * if not, updates the lead user's validation status and triggers tenant creation.
   * @param {LeadUser} lead - The `lead` parameter is an object of type `LeadUser`.
   * It represents a lead user who is going through the onboarding process.
   */
  async onboardForLead(dto: Omit<TenantOnboardDTO, 'contact'>, lead: LeadUser) {
    const existing = await this.leadRepository.findOne({
      where: {
        id: lead.id,
        isValidated: true,
      },
      include: ['tenant'],
    });
    if (!existing) {
      this.logger.error(`Valid Lead with id ${lead.id} does not exist`);
      throw new HttpErrors.Unauthorized();
    }

    if (existing.tenant) {
      this.logger.error(`Lead with id ${lead.id} has a tenant`);
      throw new HttpErrors.Unauthorized();
    }
    await this.leadRepository.updateById(lead.id, {
      isValidated: true,
    });
    return this.onboard(
      {
        ...dto,
        contact: new Contact({
          email: existing.email,
          type: 'admin',
          firstName: existing.firstName,
          lastName: existing.lastName,
          isPrimary: true,
        }),
      },
      existing,
    );
  }

  /**
   * The `setupTenant` function creates a new tenant with the provided information and an optional lead,
   * and returns the created tenant.
   * @param {TenantOnboardDTO} dto - The `dto` parameter is an object of type `TenantOnboardDTO` which
   * contains the necessary information to onboard a new tenant. It includes properties such as `key`,
   * `country`, `address`, `city`, `state`, `zip`, and `name`.
   * @param {Lead} [lead] - The `lead` parameter is an optional parameter of type `Lead`. It represents
   * the lead associated with the tenant being onboarded. If a lead is provided, their information will
   * be used to create a contact for the tenant. If no lead is provided, the contact will not be created.
   * @returns a Promise that resolves to a Tenant object.
   */
  async onboard(dto: TenantOnboardDTO, lead?: Lead): Promise<Tenant> {
    const transaction = await this.tenantRepository.beginTransaction();
    try {
      let address: Address | null = null;
      if (lead?.addressId) {
        address = await this.addressRepository.findById(lead.addressId);
        if (
          hasAnyOf(dto, ['address', 'city', 'state', 'country', 'zip']) &&
          (!weakEqual(address.address, dto.address) ||
            !weakEqual(address.city, dto.city) ||
            !weakEqual(address.state, dto.state) ||
            !weakEqual(address.country, dto.country) ||
            !weakEqual(address.zip, dto.zip))
        ) {
          throw new HttpErrors.BadRequest('Address mismatch with Lead');
        }
      } else if (dto.country) {
        address = await this.addressRepository.create(
          {
            country: dto.country,
            address: dto.address,
            city: dto.city,
            state: dto.state,
            zip: dto.zip,
          },
          {transaction},
        );
      } else {
        // Do Nothing
      }
      const tenant = await this.tenantRepository.create(
        {
          key: dto.key,
          name: dto.name ?? lead?.companyName,
          leadId: lead?.id,
          domains: dto.domains,
          status: TenantStatus.PENDINGPROVISION,
          addressId: address?.id,
        },
        {transaction},
      );
      const contactHostName = dto.contact.email.split('@')[1];
      if (!dto.domains.includes(contactHostName)) {
        throw new HttpErrors.BadRequest(
          'Contact email domain does not match tenant domains',
        );
      }
      await this.contactRepository.create(
        {
          email: dto.contact.email,
          communicationEmail: dto.contact.communicationEmail,
          firstName: dto.contact.firstName,
          lastName: dto.contact.lastName,
          tenantId: tenant.id,
          isPrimary: dto.contact.isPrimary,
        },
        {transaction},
      );
      const res = await this.tenantRepository.findById(
        tenant.id,
        {
          include: [
            {relation: 'contacts'},
            {relation: 'resources'},
            {relation: 'lead'},
            {relation: 'address'},
          ],
        },
        {transaction},
      );

      await transaction.commit();
      return res;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
