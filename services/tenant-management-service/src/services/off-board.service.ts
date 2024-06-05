import {repository} from '@loopback/repository';
import {TenantRepository, WebhookSecretRepository} from '../repositories';
import {TenantStatus} from '../enums';
import {inject, service} from '@loopback/core';
import {CryptoHelperService} from './crypto-helper.service';
import {OFFBOARDING_PIPELINES} from '../keys';
import {TenantTierDTO} from '../models/dtos/tenant-tier-dto.model';
import {HttpErrors} from '@loopback/rest';
import {CodeBuildService} from './aws';
import {ILogger, LOGGER} from '@sourceloop/core';
import {OffBoard} from '../enums/off-board.enum';

export class OffBoardService {
  constructor(
    @service(CryptoHelperService)
    private cryptoHelperService: CryptoHelperService,
    @repository(TenantRepository)
    private readonly tenantRepository: TenantRepository,
    @repository(WebhookSecretRepository)
    private webhookSecretRepo: WebhookSecretRepository,
    @service(CodeBuildService)
    private codeBuildService: CodeBuildService,
    @inject(OFFBOARDING_PIPELINES)
    private offBoardingPipelines: Record<OffBoard, string>,
    @inject(LOGGER.LOGGER_INJECT)
    private logger: ILogger,
  ) {}

  async offBoardTenant(tenantId: string, dto: TenantTierDTO) {
    await this.tenantRepository.updateById(tenantId, {
      status: TenantStatus.OFFBOARDING,
    });

    const hmacSecret = this.cryptoHelperService.generateRandomString(32);

    if (!this.offBoardingPipelines[dto.tier]) {
      this.logger.error(`Pipeline not configured for tier: ${dto.tier}`);
      throw new HttpErrors.InternalServerError();
    }

    // trigger the codebuild pipeline
    const startOutput = await this.codeBuildService.startBuild(
      this.offBoardingPipelines[dto.tier],
      {},
    );

    if (!startOutput.build?.id) {
      throw new HttpErrors.InternalServerError('Failed to start build');
    }

    await this.webhookSecretRepo.set(`${tenantId}:offboarding`, {
      secret: hmacSecret,
      context: startOutput.build.id,
    });
    await this.webhookSecretRepo.expire(
      `${tenantId}:offboarding`,
      +process.env.WEBHOOK_SECRET_EXPIRY!,
    );
  }
}
