const OKTA_DOMAIN = process.env.REACT_APP_OKTA_DOMAIN;
const OKTA_CLIENT_ID = process.env.REACT_APP_OKTA_CLIENT_ID;
const REACT_APP_PORT = process.env.REACT_APP_PORT;

export const oktaConfig = {
    issuer: `https://${OKTA_DOMAIN}/oauth2/default`,
    clientId: OKTA_CLIENT_ID,
    redirectUri: `http://localhost:${REACT_APP_PORT}/login/callback`,
    scopes: ["openid", "profile", "email"],
    pkce: true,
    responseType: 'code',
    disabeHttpsCheck: true
};