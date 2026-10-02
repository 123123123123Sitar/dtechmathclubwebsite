# Security and Puzzle Night rollout

The code and Firestore rules must be deployed together. The new website admin portal checks its server-controlled `/users/{uid}.isAdmin` flag; the shared Firestore rules still support the existing configured-email and site-profile admin paths used by other Math Club systems.

The checked-in `firestore.rules` now incorporates the live `dpotd-app` rules exported on 2026-10-02 (source SHA-256 begins `110a3d7a9dcc`) and preserves its DTMT, archive, timer, and other shared collections. Do not replace it with the earlier short repo ruleset.

On 2026-10-02, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` were set in Vercel Production for project `dtechmathclubwebsite`; the code was deployed to `https://dtechmathclubwebsite.vercel.app`; and the merged Firestore rules were published to `dpotd-app`. The obsolete `settings/appSettings.siteAdminAccessCodeHash` field was deleted. For local migration and role scripts, set `GOOGLE_APPLICATION_CREDENTIALS` to the path of a service-account JSON file from Firebase project `dpotd-app`. Keep that file outside the repo and do not share its contents. The scripts explicitly target `dpotd-app`.

**Production-domain mismatch:** `dtechmathclub.org` is currently serving a different, newer site. Its Puzzle Night page says Friday, December 4, 2026 and lists sponsors absent from this checkout. The Vercel project above has only `dtechmathclubwebsite.vercel.app` in its Domains settings. Do not move the custom domain to this project or replace its content until the actual hosting project and source have been identified and the newer content reconciled. The Firebase rules are shared and are live regardless of this mismatch.

1. Audit legacy D.PotD ownership with `node scripts/migrate-dpotd-owners.mjs`. Review the reported ownership changes, existing admin/grader records, and submissions without a matching Authentication user. Revoke any unintended privileged roles with trusted server access before changing the rules. Then run the migration with `--apply` after reviewing the count. It copies email-keyed portal users to their Authentication UID without copying privileged roles and assigns missing submission owners.
2. The existing `dtechmathclub@gmail.com` Authentication account has UID `lsxhqeGiqzVAwyTasBRvpGSDDnI2`, matching its `/users` document with `isAdmin: true` as inspected in the Firebase console on 2026-10-02. Reconfirm the role audit before deploying. If a different admin is intended, set its role with server credentials:

   `GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json node scripts/grant-admin.mjs admin@example.org`

   The script looks up an existing account; it does not create one.
3. Review and restore any existing grader roles with a trusted server credential. Student accounts cannot assign roles through Firestore rules.
4. Verify Vercel project `dtechmathclubwebsite` in team `sitar-eswars-projects` has those same three Firebase Admin environment variables. The new `/api/dpotd-summary` endpoint uses them to return scores without exposing raw submissions.
   Link this checkout with `vercel link --yes --team sitar-eswars-projects --project dtechmathclubwebsite`, then inspect variable names with `vercel env ls`. Run each command separately because an interactive login can consume following terminal input.
5. Deploy the site code to that Vercel project, then deploy `firestore.rules` with `firebase deploy --only firestore:rules --project dpotd-app` from this directory.
6. Remove `siteAdminAccessCode` and `siteAdminAccessCodeHash` from `settings/appSettings`. The admin page no longer uses an access code.
7. Smoke check with separate accounts: student signup and one-time Puzzle Night submission; student D.PotD history and leaderboard; grader assigned queue; admin dashboard. A student must not be able to read another student's `/users` or `/submissions` document or set their own `isAdmin` flag.

The 2026 Puzzle Night date is not present in this repo, but the current custom-domain site says December 4, 2026. Reconcile event details against the authoritative site before further deployment.
