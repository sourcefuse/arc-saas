import {inject, injectable, BindingScope} from '@loopback/core';
import {AWS_CODEBUILD_CLIENT} from './keys';
import {
  CodeBuildClient,
  EnvironmentVariable,
  StartBuildCommand,
  StartBuildCommandInput,
} from '@aws-sdk/client-codebuild';
import {AnyObject} from '@loopback/repository';

/**
 * Service for handling AWS CodeBuild operations.
 * This service is responsible for starting build processes using the AWS CodeBuild client.
 */
@injectable({scope: BindingScope.TRANSIENT})
export class CodeBuildService {
  /**
   * Constructs a new instance of the CodeBuildService.
   * @param {CodeBuildClient} codeBuildClient - The AWS CodeBuild client to use.
   */
  constructor(
    @inject(AWS_CODEBUILD_CLIENT)
    private readonly codeBuildClient: CodeBuildClient,
  ) {}

  /**
   * The `startBuild` function starts a build process with the specified project name and environment
   * variables.
   * @param {string} type - The `type` parameter is a string that represents the project name for the
   * build.
   * @param {T} data - The `data` parameter is of type `T`, which extends `AnyObject`. It represents the
   * data that will be used to override the environment variables for the build.
   * @returns The `startBuild` function is returning a promise that resolves to the result of sending a
   * `StartBuildCommand` using the `codeBuildClient`.
   */
  async startBuild<T extends AnyObject>(type: string, data: T) {
    const params: StartBuildCommandInput = {
      projectName: type,
      environmentVariablesOverride: this._buildEnvironment(data),
    };
    const command = new StartBuildCommand(params);
    return this.codeBuildClient.send(command);
  }

  private _buildEnvironment<T extends AnyObject>(
    data: T,
  ): EnvironmentVariable[] {
    return Object.keys(data).map(key => {
      return {
        name: key,
        value: String(data[key]),
        type: 'PLAINTEXT',
      };
    });
  }
}
