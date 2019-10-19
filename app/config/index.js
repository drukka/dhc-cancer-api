module.exports = {
  // server
  PORT: process.env.PORT || 8000,
  EMAIL_ACTIVATION_URL: process.env.EMAIL_ACTIVATION_URL,
  PASSWORD_RESET_URL: process.env.PASSWORD_RESET_URL,
  PROFILE_PICTURE_URL: process.env.PROFILE_PICTURE_URL,
  DEFAULT_RESOURCES_URL: process.env.DEFAULT_RESOURCES_URL,

  // security
  ENCRYPTION_SALT_ROUNDS: process.env.ENCRYPIPION_SALT_ROUDS || 10,
  AUTH_JWT_SECRET: process.env.AUTH_JWT_SECRET || 'superCoolS3cr3tKEY',
  MISC_JWT_TOKEN: process.env.MISC_JWT_TOKEN || 'verC00lJwTtOk3nSEcret',

  // oas-tools
  OAS_TOOLS_CONFIGURATION: {
    controllers: `${__dirname}/..`, // can't select multiple paths, so we define it in the documentation
    checkControllers: false,
    loglevel: process.env.NODE_ENV !== 'production' ? 'debug' : 'error',
    router: true,
    strict: true,
    validator: true,
    docs: {
      apiDocs: '/api-docs',
      apiDocsPrefix: '',
      swaggerUi: '/docs',
      swaggerUiPrefix: ''
    },
    oasSecurity: true,
    securityFile: {},
    oasAuth: true,
    customErrorHandling: false
  },

  // email sending
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  DEFAULT_MAIL_FROM: process.env.DEFAULT_MAIL_FROM,

  // localization
  AVAILABLE_LANGUAGES: process.env.AVAILABLE_LANGUAGES,
  I18N_CONFIGURATION: {
    locales: process.env.AVAILABLE_LANGUAGES,
    directory: `${__dirname}/locales`,
    defaultLocale: 'en'
  },

  // etc
  COMPANY: process.env.COMPANY || 'Skeleton' // e.g. jwt token issuer
};
