import {PostInvitationsRequestAppMetadata} from 'auth0';
export interface UserData {
  email?: string;
  // eslint-disable-next-line
  phone_number?: string;
  // eslint-disable-next-line
  user_metadata?: {[key: string]: any};
  blocked?: boolean;
  // eslint-disable-next-line
  email_verified?: boolean;
  // eslint-disable-next-line
  app_metadata?: PostInvitationsRequestAppMetadata;
  // eslint-disable-next-line
  given_name?: string;
  // eslint-disable-next-line
  family_name?: string;
  name?: string;
  nickname?: string;
  picture?: string;
  // eslint-disable-next-line
  user_id?: string;
  connection: string;
  password?: string;
  // eslint-disable-next-line
  verify_email?: boolean;
  username?: string;
}
export interface OrganizationData {
  name: string;
  // eslint-disable-next-line
  display_name?: string;
  // eslint-disable-next-line
  logo_url?: string;
  // eslint-disable-next-line
  primary_color?: string;
  // eslint-disable-next-line
  page_background?: string;
  // eslint-disable-next-line
  link_color?: string;
}
export interface ConfigValue extends Omit<UserData, 'name'>, OrganizationData {
  username: UserData['name'];
}
export type Auth0Response = {
  organizationId: string;
  userId: string;
};
