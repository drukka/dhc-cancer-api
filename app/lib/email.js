'use strict';

const { I18N_CONFIGURATION, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER, DEFAULT_MAIL_FROM } = require('../config');

const Email = require('email-templates');
const fs = require('fs');

const email = new Email({
  message: {
    from: DEFAULT_MAIL_FROM
  },
  preview: false,
  transport: {
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false, // https://github.com/nodemailer/nodemailer/issues/709
    pool: true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD
    }
  },
  send: process.env.NODE_ENV !== 'test',
  render: (view, locals) => {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../resources/templates/${view}.hbs`, 'utf8', (err, file) => {
        if (err) reject(err);
        else {
          const handlebars = require('handlebars');
          const i18n = require('i18n');

          i18n.configure(I18N_CONFIGURATION);
          i18n.setLocale(locals.language);

          handlebars.registerHelper('__', (str, ...params) => {
            return i18n.__(str, ...params);
          });

          const template = handlebars.compile(file, {
            noEscape: true
          });

          email.juiceResources(template(locals)).then(html => {
            resolve(html);
          });
        }
      });
    });
  }
});

exports.send = (template, to, locals, language) => {
  language = language || 'en';
  locals['language'] = language;
  return email.send({
    template: template,
    message: {
      to: to
    },
    locals: locals
  }).catch(console.error);
};
