const fs = require('fs');
const path = require('path');

const {
    AUTH_PUBLIC_KEY,
    AUTH_PRIVATE_KEY
 } = process.env;

let privateCert = AUTH_PRIVATE_KEY;
if(!privateCert) {
    const privateKeyFilePath =
        process.env.AUTH_PRIVATE_KEY_FILE ||
        path.resolve(__dirname, './jwtPrivate.key');

    privateCert = fs.readFileSync(privateKeyFilePath);
} else {
    privateCert = privateCert.replace(/\\n/gm, '\n');
}
let publicCert = AUTH_PUBLIC_KEY;
if(!publicCert) {
    const publicKeyFilePath =
        process.env.AUTH_PUBLIC_KEY_FILE ||
        path.resolve(__dirname, './jwtPublic.key');

    publicCert = fs.readFileSync(publicKeyFilePath);
} else {
    publicCert = publicCert.replace(/\\n/gm, '\n');
}

module.exports = Object.assign(
    {},
    {
        privateCert,
        publicCert
    }
);
