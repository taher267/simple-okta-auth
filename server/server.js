// yarn add express cors @okta/jwt-verifier
import express from 'express';
import OktaJwtVerifier from '@okta/jwt-verifier';
import cors from 'cors';
const app = express();
app.use(cors());
//Okta auth
const OKTA_DOMAIN = 'dev-xxxxxxxxxx.okta.com';
const OKTA_SERVER_ID = 'default';

const oktaJWTVerifier = new OktaJwtVerifier({ issuer: `https://${OKTA_DOMAIN}/oauth2/${OKTA_SERVER_ID}` });

const OktaAuthentication = async (req, res, nex) => {
    try {
        const authHeader = req.headers.authorization || '';
        console.log(authHeader);
        if (!authHeader) {
            res.status(401);
            return nex('Unauthourized, no bearer');
        }

        const match = authHeader.match(/Bearer (.+)/);
        if (!match) {
            res.status(401);
            return nex('Unauthourized, Bearer not match');
        }

        const accessToken = match[1];
        const audience = 'api://default';
        const jwt = await oktaJWTVerifier.verifyAccessToken(accessToken, audience);
        req.jwt = jwt;
        nex();
    } catch (e) {
        nex(e);
    }
};

app.get('/api/protected', OktaAuthentication, (req, res) => {
    res.json({
        msg: 'Alhamdu Lillah, Private route is working',
        time: Date.now().toString()
    });
});
app.get('/api/public', (req, res) => {
    res.json({
        msg: 'Alhamdu Lillah, Public route',
        time: Date.now().toString()
    });
});

app.listen(8008, _ => console.log(`Server is listening on port 8008`));


