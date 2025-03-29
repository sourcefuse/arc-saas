// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  UserRepository,
  UserCredentialsRepository,
  SignUpBindings,
  CognitoSignUpFn,
  VerifyBindings,
  AuthUser,
  CognitoPostVerifyFn,
  CognitoPreVerifyFn,
} from '@sourceloop/authentication-service';
import {
  AuthErrorKeys,
  Cognito,
  IAuthUser,
  VerifyFunction,
} from 'loopback4-authentication';

export class CognitoOauthVerifyProvider
  implements Provider<VerifyFunction.CognitoAuthFn>
{
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
    @inject(SignUpBindings.COGNITO_SIGN_UP_PROVIDER)
    private readonly signupProvider: CognitoSignUpFn,
    @inject(VerifyBindings.COGNITO_PRE_VERIFY_PROVIDER)
    private readonly preVerifyProvider: CognitoPreVerifyFn,
    @inject(VerifyBindings.COGNITO_POST_VERIFY_PROVIDER)
    private readonly postVerifyProvider: CognitoPostVerifyFn,
  ) {}

  value(): VerifyFunction.CognitoAuthFn {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: Cognito.Profile,
    ) => {
      let user: IAuthUser | null = await this.userRepository.findOne({
        where: {
          email: profile.email,
        },
      });
      user = await this.preVerifyProvider(
        accessToken,
        refreshToken,
        profile,
        user,
      );
      if (!user) {
        throw new HttpErrors.BadRequest('User Not Found');
      }
      const creds = await this.userCredsRepository.findOne({
        where: {
          userId: user.id as string,
        },
      });
      if (
        !creds ||
        creds.authProvider !== 'aws-cognito' ||
        creds.authId !== profile.sub
      ) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }

      const authUser: AuthUser = new AuthUser({
        ...user,
        id: user.id as string,
      });
      authUser.permissions = [];
      authUser.externalAuthToken = accessToken;
      authUser.externalRefreshToken = refreshToken;
      return this.postVerifyProvider(profile, authUser);
    };
  }
}
