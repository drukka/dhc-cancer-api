'use strict';

const swaggerJSDoc = require('swagger-jsdoc');

exports.loadSpecification = () => {
  const options = {
    swaggerDefinition: {
      openapi: '3.0.1',
      info: {
        title: 'OpenAPI based express api skeleton',
        description: `This is the updated version of the Express API Skeleton project. It includes many changes, the most important one is that now the skeleton is based on the OpenAPI 3.0 specification.
          \n Details:
          \n* **Authentication**:
          \n  The api uses Bearer authentication with pre-defined scopes. Feel free to use the authorization option in SwaggerUI to try.
          \n* **Language**:
          \n  In cases you want to specify in which language the api sould return the response, use the \`Accept-Language\` header. If it's not specified, than the user's language will be used. If neither is specified, the default language is \`en-US\`. If you set the language, use the [proper format](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language)`,
        version: '2.0'
      },
      components: {
        securitySchemes: {
          Bearer: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            'x-acl-config': {
              user: {
                '$extend': ['anonymous'],
                'users/me': {
                  'create:any': ['*'],
                  'read:any': ['*'],
                  'update:any': ['*'],
                  'delete:any': ['*']
                }
              },
              superAdmin: {
                '$extend': ['user'],
                'users': {
                  'create:any': ['*'],
                  'read:any': ['*'],
                  'update:any': ['*'],
                  'delete:any': ['*']
                }
              },
              anonymous: {}
            }
          }
        }
      }
    },
    apis: [
      `${__dirname}/../api/specifications/**/*.yaml`,
      `${__dirname}/../auth/specifications/**/*.yaml`
    ]
  };

  return swaggerJSDoc(options);
};
