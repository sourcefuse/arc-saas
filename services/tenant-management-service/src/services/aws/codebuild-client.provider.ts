import {Provider} from '@loopback/core';
import {CodeBuildClient} from '@aws-sdk/client-codebuild';
/* The CodebuildClientProvider class is a provider for creating instances of the CodeBuildClient class. */
export class CodebuildClientProvider implements Provider<CodeBuildClient> {
  value() {
    return new CodeBuildClient({
      region: process.env.AWS_REGION,
    });
  }
}
