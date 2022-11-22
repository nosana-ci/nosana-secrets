import fs from "fs";
import path from "path";
const { AUTH_PUBLIC_KEY, AUTH_PRIVATE_KEY } = process.env;

let privateCert: any = AUTH_PRIVATE_KEY;
if (!privateCert) {
  const privateKeyFilePath =
    process.env.AUTH_PRIVATE_KEY_FILE ||
    path.resolve(__dirname, "./jwtPrivate.key");

  privateCert = fs.readFileSync(privateKeyFilePath);
} else {
  privateCert = privateCert.replace(/\\n/gm, "\n");
}
let publicCert: any = AUTH_PUBLIC_KEY;
if (!publicCert) {
  const publicKeyFilePath =
    process.env.AUTH_PUBLIC_KEY_FILE ||
    path.resolve(__dirname, "./jwtPublic.key");

  publicCert = fs.readFileSync(publicKeyFilePath);
} else {
  publicCert = publicCert.replace(/\\n/gm, "\n");
}

export default Object.assign(
  {},
  {
    privateCert,
    publicCert,
  }
);
