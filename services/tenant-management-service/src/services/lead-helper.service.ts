import {injectable, BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {LeadRepository} from '../repositories';
import {LeadUserWithToken} from '../types';
import {VerifyLeadResponseDTO} from '../models/dtos/verify-lead-response-dto.model';

@injectable({scope: BindingScope.TRANSIENT})
export class LeadHelperService {
  constructor(
    @repository(LeadRepository)
    private readonly leadRepository: LeadRepository,
  ) {}

  async validateLead(
    id: string,
    leadUser: LeadUserWithToken,
  ): Promise<VerifyLeadResponseDTO> {
    if (leadUser.id !== id) {
      throw new HttpErrors.Unauthorized();
    }

    await this.leadRepository.updateById(leadUser.id, {
      isValidated: true,
    });

    return new VerifyLeadResponseDTO({
      id: leadUser.id,
      token: leadUser.token,
    });
  }
}
