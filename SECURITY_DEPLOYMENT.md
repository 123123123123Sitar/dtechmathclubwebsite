# Security and Puzzle Night rollout

The code and Firestore rules must be deployed together. The new rules no longer treat the email in `settings/appSettings` as proof of admin access.

Set `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` in the trusted deployment environment before running the migration or role script.

1. Audit legacy D.PotD ownership with `node scripts/migrate-dpotd-owners.mjs`. Review the reported ownership changes, existing admin/grader records, and submissions without a matching Authentication user. Revoke any unintended privileged roles with trusted server access before changing the rules. Then run the migration with `--apply` after reviewing the count. It copies email-keyed portal users to their Authentication UID without copying privileged roles and assigns missing submission owners.
2. Confirm the existing admin has a Firebase Authentication account and set its role with server credentials:

   `node scripts/grant-admin.mjs admin@example.org`

   The script looks up an existing account; it does not create one.
3. Review and restore any existing grader roles with a trusted server credential. Student accounts cannot assign roles through Firestore rules.
4. Verify Vercel project `dtechmathclubwebsite` in team `sitar-eswars-projects` has those same three Firebase Admin environment variables. The new `/api/dpotd-summary` endpoint uses them to return scores without exposing raw submissions.
   Link this checkout with `vercel link --yes --team sitar-eswars-projects --project dtechmathclubwebsite`, then inspect variable names with `vercel env ls`. Run each command separately because an interactive login can consume following terminal input.
5. Deploy the site code to that Vercel project, then deploy `firestore.rules` with `firebase deploy --only firestore:rules --project dpotd-app`.
6. Remove `siteAdminAccessCode` and `siteAdminAccessCodeHash` from `settings/appSettings`. The admin page no longer uses an access code.
7. Smoke check with separate accounts: student signup and one-time Puzzle Night submission; student D.PotD history and leaderboard; grader assigned queue; admin dashboard. A student must not be able to read another student's `/users` or `/submissions` document or set their own `isAdmin` flag.

The 2026 Puzzle Night date is not present in the repo. The site now says the date will be announced and labels the listed times as a typical schedule. Replace these messages when organizers confirm the event details.
