# Review, release and rollback

## Prepare in the website workspace

1. Update the one catalog source and corresponding downloads. Keep stable IDs/slugs. Add a version-history entry for changed behavior and an honest update date. Keep all published translations complete.
2. Run `node scripts/validate-resources.mjs` and `node --test scripts/test-resources.mjs`. Run the website's type, lint, SEO, build and browser checks. Inspect any Brain proposal separately; observed source hashes are not installation evidence.
3. Run `node scripts/export-resources.mjs`. It creates `artifacts/rocketlauncher-resources` from an explicit allowlist and refuses an existing destination. For a later candidate pass a new empty destination, for example `artifacts/rocketlauncher-resources-next`. Do not copy the whole website repository.
4. Inspect the exported README, catalog, files, validator, licenses and checksums. Run `node validate-resources.mjs catalog.json .` inside the export. Compare checksums and resource versions with the reviewed diff. No `.env`, private server, Brain data or site backend belongs in this package.

## Publication requires separate authorization

The owner reviews this concrete export, the intended new public repository name and visibility, and the release version. The initial public resource repository was authorized by the owner; website production deployment remains a separate decision. Do not change the private site's visibility.

After explicit authorization, create a separate repository from the exported package only, review its file list once more, publish the approved commit and attach the checksum manifest to a versioned release. Record the actual repository URL on the website before enabling source/issues/contribution links. Tag releases using the approved package version and retain old resource versions. Never label an installation tested without its actual evidence.

Website deployment is a separate authorized step. Record the approved Git revision and prior Vercel deployment before promoting the website. Verify the real download MIME/bytes, metadata, language links and consent-aware events after release. An outbound University click is not proof of membership.

## Rollback

Retain the previous exported package, checksums and release tag. If a resource is faulty, mark that release withdrawn with the known limitation and publish a reviewed correction; do not rewrite an existing tag or silently replace immutable release assets. Restore the previous approved site revision/Vercel deployment when the website is affected. Record the incident, source revision and measured result in the private Brain outcome ledger. Keep public package data separate from that ledger.
