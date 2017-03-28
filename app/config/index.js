'use strict';

if (process.env.NODE_ENV === 'production') {

  module.exports = {
    host: process.env.host || "",
    dbURI: process.env.dbURI,
    sessionSecret: process.env.sessionSecret,
    // Auth0 config options
    auth0Config: {
      languageDictionary: {
        title: "PACM DATA"
      },
      auth: {
        redirectUrl: process.env.AUTH0_CALLBACK_URL,
        responseType: 'code',
        params: {
          scope: 'openid name email picture'
        }
      },
      theme: {
        primaryColor: '#2c3e50',
        logo: "/images/pacm_data_logo(55px).png"
      }
    }
  }
} else {
  // offer dev stage settings and data
  module.exports = require('./development.json');
}
