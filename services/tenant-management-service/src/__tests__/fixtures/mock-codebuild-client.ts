import {StartBuildCommand, CodeBuildClient} from '@aws-sdk/client-codebuild';
export const MOCK_CODEBUILD_CLIENT = {
  send: (cmd: StartBuildCommand) => {
    return {
      build: {
        id: 'test-id',
      },
    };
  },
} as unknown as CodeBuildClient;
