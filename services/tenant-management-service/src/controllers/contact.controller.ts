import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {del, get, param, patch, post, put, requestBody} from '@loopback/rest';
import {
  CONTENT_TYPE,
  getModelSchemaRefSF,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {ContactRepository} from '../repositories/contact.repository';
import {Contact} from '../models';
import {PermissionKey} from '../permissions';

const basePath = '/contacts';

export class ContactController {
  constructor(
    @repository(ContactRepository)
    public contactRepository: ContactRepository,
  ) {}

  @authorize({
    permissions: [PermissionKey.CreateContact],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Contact model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRefSF(Contact)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRefSF(Contact, {
            title: 'NewContact',
            exclude: ['id'],
          }),
        },
      },
    })
    contact: Omit<Contact, 'id'>,
  ): Promise<Contact> {
    return this.contactRepository.create(contact);
  }

  @authorize({
    permissions: [PermissionKey.ViewContact],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Contact model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Contact) where?: Where<Contact>): Promise<Count> {
    return this.contactRepository.count(where);
  }

  @authorize({
    permissions: [PermissionKey.ViewContact],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Contact model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRefSF(Contact, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Contact) filter?: Filter<Contact>,
  ): Promise<Contact[]> {
    return this.contactRepository.find(filter);
  }

  @authorize({
    permissions: [PermissionKey.UpdateContact],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Contact PATCH success',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRefSF(Contact),
          },
        },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRefSF(Contact, {partial: true}),
        },
      },
    })
    contact: Contact,
    @param.where(Contact) where?: Where<Contact>,
  ): Promise<Count> {
    return this.contactRepository.updateAll(contact, where);
  }

  @authorize({
    permissions: [PermissionKey.ViewContact],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Contact model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRefSF(Contact)},
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Contact, {exclude: 'where'})
    filter?: Filter<Contact>,
  ): Promise<Contact> {
    return this.contactRepository.findById(id, filter);
  }

  @authorize({
    permissions: [PermissionKey.UpdateContact],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Contact PATCH success',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRefSF(Contact),
          },
        },
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRefSF(Contact, {partial: true}),
        },
      },
    })
    contact: Contact,
  ): Promise<void> {
    await this.contactRepository.updateById(id, contact);
  }

  @authorize({
    permissions: [PermissionKey.UpdateContact],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @put(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Contact PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() contact: Contact,
  ): Promise<void> {
    await this.contactRepository.replaceById(id, contact);
  }

  @authorize({
    permissions: [PermissionKey.DeleteContact],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @del(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Contact DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.contactRepository.deleteById(id);
  }
}
