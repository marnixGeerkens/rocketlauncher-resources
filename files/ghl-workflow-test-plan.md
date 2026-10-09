# GoHighLevel workflow test plan

Workflow name:
Owner:
Account and version/date:
Trigger and filters:
Expected actions:
Allowed test contacts:
Stop condition:

## Before activation
- Duplicate or export the current configuration where supported.
- Keep the candidate workflow unpublished while checking conditions.
- Confirm communication consent and suppression rules.
- Use your own controlled test contact and phone/email destination.

## Test cases
1. Matching trigger: expected action happens once.
2. Non-matching trigger: no action happens.
3. Repeated trigger: no unintended duplicate message.
4. Opt-out or suppression: no outbound communication.
5. Missing field: safe fallback or an explicit stop.
6. Failure: inspect execution history and record the error.

## Evidence and release
Record time, anonymized test case, expected result and observed result.
Do not publish until the owner approves the results.
Rollback: disable the candidate and restore the recorded prior configuration. Check for actions already queued; disabling does not undo a sent message.
