import { createHash, createSign } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!credentialsPath) {
  console.error("Set GOOGLE_APPLICATION_CREDENTIALS to the dpotd-app service-account JSON path.");
  process.exit(1);
}

const credentials = JSON.parse(await readFile(credentialsPath, "utf8"));
if (credentials.project_id !== "dpotd-app") {
  throw new Error("The service-account file does not belong to dpotd-app.");
}

const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
const now = Math.floor(Date.now() / 1000);
const payload = {
  iss: credentials.client_email,
  sub: credentials.client_email,
  aud: credentials.token_uri,
  scope: "https://www.googleapis.com/auth/firebase",
  iat: now,
  exp: now + 3600,
};
const unsigned = `${encode({ alg: "RS256", typ: "JWT" })}.${encode(payload)}`;
const signer = createSign("RSA-SHA256");
signer.update(unsigned);
const assertion = `${unsigned}.${signer.sign(credentials.private_key).toString("base64url")}`;

const tokenResponse = await fetch(credentials.token_uri, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  }),
});
if (!tokenResponse.ok) throw new Error(`Google token request failed (${tokenResponse.status}).`);
const { access_token: token } = await tokenResponse.json();

async function getRulesResource(path) {
  const response = await fetch(`https://firebaserules.googleapis.com/v1/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Firebase Rules request failed (${response.status}).`);
  return response.json();
}

const releases = await getRulesResource("projects/dpotd-app/releases");
const release = releases.releases?.find((item) => item.name.endsWith("/cloud.firestore"));
if (!release) throw new Error("No active Cloud Firestore rules release found.");
const ruleset = await getRulesResource(release.rulesetName);
const files = ruleset.source?.files || [];
if (files.length !== 1 || !files[0].content) {
  throw new Error(`Expected one Firestore rules file; found ${files.length}.`);
}

const destination = new URL("../firestore.live.rules", import.meta.url);
await writeFile(destination, files[0].content, { flag: "wx", mode: 0o600 });
const hash = createHash("sha256").update(files[0].content).digest("hex").slice(0, 12);
console.log(`Saved ${files[0].content.length} bytes of live Firestore rules (SHA-256 ${hash}…).`);
