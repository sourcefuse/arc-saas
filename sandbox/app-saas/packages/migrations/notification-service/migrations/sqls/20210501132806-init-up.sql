CREATE SCHEMA IF NOT EXISTS main;

SET search_path TO main, public;

GRANT ALL ON SCHEMA main TO public;

CREATE TABLE main.notification_users(
    deleted boolean DEFAULT FALSE,
    deleted_on timestamptz,
    deleted_by uuid,
    created_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id uuid DEFAULT md5(random()::text || clock_timestamp()::text) ::uuid NOT NULL,
    notification_id uuid NOT NULL,
    user_id uuid NOT NULL,
    is_read boolean DEFAULT FALSE,
    action_meta text,
    CONSTRAINT notification_users_pkey PRIMARY KEY (id)
);

CREATE TABLE main.notifications(
    id uuid DEFAULT md5(random()::text || clock_timestamp()::text) ::uuid NOT NULL,
    subject varchar(100),
    body varchar(250) NOT NULL,
    receiver json NOT NULL,
    "type" integer NOT NULL,
    sent timestamptz,
    "options" text,
    CONSTRAINT notifications_pkey PRIMARY KEY (id)
);

CREATE TABLE main.notification_templates(
    id uuid DEFAULT (md5(((random())::text ||(clock_timestamp())::text))) ::uuid NOT NULL,
    event_name varchar(500) NOT NULL,
    body text NOT NULL,
    notification_type numeric NOT NULL,
    subject varchar(200),
    created_by uuid,
    created_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_by uuid,
    modified_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted bool DEFAULT FALSE NOT NULL,
    deleted_on timestamptz,
    deleted_by uuid,
    CONSTRAINT pk_email_templates_id PRIMARY KEY (id)
);

ALTER TABLE main.notification_users
    ALTER COLUMN user_id TYPE varchar(200);

ALTER TABLE main.notifications
    ALTER COLUMN body TYPE text;

CREATE OR REPLACE FUNCTION main.moddatetime()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $function$
BEGIN
    NEW.modified_on = now();
    RETURN NEW;
END;
$function$;

CREATE TRIGGER mdt_notification_users
    BEFORE UPDATE ON main.notification_users
    FOR EACH ROW
    EXECUTE FUNCTION main.moddatetime('modified_on');

CREATE TRIGGER mdt_notifications
    BEFORE UPDATE ON main.notifications
    FOR EACH ROW
    EXECUTE FUNCTION main.moddatetime('modified_on');

CREATE TRIGGER mdt_notification_templates
    BEFORE UPDATE ON main.notification_templates
    FOR EACH ROW
    EXECUTE FUNCTION main.moddatetime('modified_on');

INSERT INTO main.notification_templates(event_name, body, subject, notification_type)
    VALUES ('validate_lead', '<!doctype html>
        <html lang="en">
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>{{appName}}: Validate Email</title>
            <style media="all" type="text/css">
        @media all {
          .btn-primary table td:hover {
            background-color: #ec0867 !important;
          }
        
          .btn-primary a:hover {
            background-color: #ec0867 !important;
            border-color: #ec0867 !important;
          }
        }
        @media only screen and (max-width: 640px) {
          .main p,
        .main td,
        .main span {
            font-size: 16px !important;
          }
        
          .wrapper {
            padding: 8px !important;
          }
        
          .content {
            padding: 0 !important;
          }
        
          .container {
            padding: 0 !important;
            padding-top: 8px !important;
            width: 100% !important;
          }
        
          .main {
            border-left-width: 0 !important;
            border-radius: 0 !important;
            border-right-width: 0 !important;
          }
        
          .btn table {
            max-width: 100% !important;
            width: 100% !important;
          }
        
          .btn a {
            font-size: 16px !important;
            max-width: 100% !important;
            width: 100% !important;
          }
        }
        @media all {
          .ExternalClass {
            width: 100%;
          }
        
          .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
            line-height: 100%;
          }
        
          .apple-link a {
            color: inherit !important;
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            text-decoration: none !important;
          }
        
          #MessageViewBody a {
            color: inherit;
            text-decoration: none;
            font-size: inherit;
            font-family: inherit;
            font-weight: inherit;
            line-height: inherit;
          }
        }
        </style>
          </head>
          <body style="font-family: Helvetica, sans-serif; -webkit-font-smoothing: antialiased; font-size: 16px; line-height: 1.3; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #f4f5f6; margin: 0; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f4f5f6; width: 100%;" width="100%" bgcolor="#f4f5f6">
              <tr>
                <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top">&nbsp;</td>
                <td class="container" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; max-width: 600px; padding: 0; padding-top: 24px; width: 600px; margin: 0 auto;" width="600" valign="top">
                  <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 600px; padding: 0;">
        
                    <!-- START CENTERED WHITE CONTAINER -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border: 1px solid #eaebed; border-radius: 16px; width: 100%;" width="100%">
        
                      <!-- START MAIN CONTENT AREA -->
                      <tr>
                        <td class="wrapper" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; box-sizing: border-box; padding: 24px;" valign="top">
                          <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">Hi there</p>
                          <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">Click on the button below to validate your email and start your onboarding journey</p>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%; min-width: 100%;" width="100%">
                            <tbody>
                              <tr>
                                <td align="left" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; padding-bottom: 16px;" valign="top">
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                    <tbody>
                                      <tr>
                                        <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; border-radius: 4px; text-align: center; background-color: #0867ec;" valign="top" align="center" bgcolor="#0867ec"> <a href="{{link}}" target="_blank" style="border: solid 2px #0867ec; border-radius: 4px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 16px; font-weight: bold; margin: 0; padding: 12px 24px; text-decoration: none; text-transform: capitalize; background-color: #0867ec; border-color: #0867ec; color: #ffffff;">Validate</a> </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
        
                      <!-- END MAIN CONTENT AREA -->
                      </table>
        
        
                    <!-- END FOOTER -->
                    
        <!-- END CENTERED WHITE CONTAINER --></div>
                </td>
                <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top">&nbsp;</td>
              </tr>
            </table>
          </body>
        </html>', '{{appName}}: Validate Email',
        1);

INSERT INTO main.notification_templates(event_name, body, subject, notification_type)
    VALUES ('tenant_welcome', '
    <!doctype html>
        <html lang="en">
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>Welcome to {{name}}</title>
            <style media="all" type="text/css">
        @media all {
          .btn-primary table td:hover {
            background-color: #ec0867 !important;
          }
        
          .btn-primary a:hover {
            background-color: #ec0867 !important;
            border-color: #ec0867 !important;
          }
        }
        @media only screen and (max-width: 640px) {
          .main p,
        .main td,
        .main span {
            font-size: 16px !important;
          }
        
          .wrapper {
            padding: 8px !important;
          }
        
          .content {
            padding: 0 !important;
          }
        
          .container {
            padding: 0 !important;
            padding-top: 8px !important;
            width: 100% !important;
          }
        
          .main {
            border-left-width: 0 !important;
            border-radius: 0 !important;
            border-right-width: 0 !important;
          }
        
          .btn table {
            max-width: 100% !important;
            width: 100% !important;
          }
        
          .btn a {
            font-size: 16px !important;
            max-width: 100% !important;
            width: 100% !important;
          }
        }
        @media all {
          .ExternalClass {
            width: 100%;
          }
        
          .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
            line-height: 100%;
          }
        
          .apple-link a {
            color: inherit !important;
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            text-decoration: none !important;
          }
        
          #MessageViewBody a {
            color: inherit;
            text-decoration: none;
            font-size: inherit;
            font-family: inherit;
            font-weight: inherit;
            line-height: inherit;
          }
        }
        </style>
          </head>
          <body style="font-family: Helvetica, sans-serif; -webkit-font-smoothing: antialiased; font-size: 16px; line-height: 1.3; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #f4f5f6; margin: 0; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f4f5f6; width: 100%;" width="100%" bgcolor="#f4f5f6">
              <tr>
                <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top">&nbsp;</td>
                <td class="container" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; max-width: 600px; padding: 0; padding-top: 24px; width: 600px; margin: 0 auto;" width="600" valign="top">
                  <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 600px; padding: 0;">
        
                    <!-- START CENTERED WHITE CONTAINER -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border: 1px solid #eaebed; border-radius: 16px; width: 100%;" width="100%">
        
                      <!-- START MAIN CONTENT AREA -->
                      <tr>
                        <td class="wrapper" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; box-sizing: border-box; padding: 24px;" valign="top">
                          <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">Hi {{user}}</p>
                          <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">We are almost done with your onboarding process, click on the button below to login in your tenant</p>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%; min-width: 100%;" width="100%">
                            <tbody>
                              <tr>
                                <td align="left" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; padding-bottom: 16px;" valign="top">
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                    <tbody>
                                      <tr>
                                        <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; border-radius: 4px; text-align: center; background-color: #0867ec;" valign="top" align="center" bgcolor="#0867ec"> <a href="{{{link}}}" target="_blank" style="border: solid 2px #0867ec; border-radius: 4px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 16px; font-weight: bold; margin: 0; padding: 12px 24px; text-decoration: none; text-transform: capitalize; background-color: #0867ec; border-color: #0867ec; color: #ffffff;">Login</a> </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
        
                      <!-- END MAIN CONTENT AREA -->
                      </table>
        
        
                    <!-- END FOOTER -->
                    
        <!-- END CENTERED WHITE CONTAINER --></div>
                </td>
                <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top">&nbsp;</td>
              </tr>
            </table>
          </body>
        </html>', 'Welcome to {{name}}',
        1);

