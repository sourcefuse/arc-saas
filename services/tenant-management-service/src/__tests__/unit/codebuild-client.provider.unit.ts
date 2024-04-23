import {expect} from '@loopback/testlab';
import {CodebuildClientProvider} from '../../services';
import {CodeBuildClient} from '@aws-sdk/client-codebuild';

describe(`CodeBuildClientProvider`, () => {
  it('should return a CodeBuild client', async () => {
    const provider = new CodebuildClientProvider();
    const value = provider.value();
    expect(value).to.be.instanceOf(CodeBuildClient);
  });
});
