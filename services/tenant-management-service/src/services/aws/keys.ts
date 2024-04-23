import {BindingKey} from '@loopback/core';
import {CodeBuildClient} from '@aws-sdk/client-codebuild';
export const AWS_CODEBUILD_CLIENT = BindingKey.create<CodeBuildClient>(
  'aws.codebuild.client',
);
