# RocketLauncher resources

Practical, original instructions for Claude Code, Codex, ChatGPT and GoHighLevel. Discover the resources and read their complete guides at https://rocketlauncher.ai/resources. Dutch guides are available at https://rocketlauncher.ai/nl/resources. Available languages are declared per resource; no missing translation is implied.

Individual files are free to read, copy and download without an account. RocketLauncher University offers guided projects, feedback, challenges and community support at https://www.skool.com/rocketlauncher-university. A resource download does not join the community.

## Use a resource

Read its catalog entry, including compatibility, steps, example, limitations, version and verification notes. Inspect the file before using it. Merge instructions into existing project files carefully; do not overwrite project rules or credentials. Claude skills, Codex instructions and GHL workflows have different installation and permission models. None of these files grants access to an account or authorizes production changes.

`catalog.json` is the shared website and distribution source. `files/` contains the original downloadable files, with matching content in the catalog. The `/resources/files/` URL prefix becomes `files/` inside this package. English download files can have translated explanatory guides; the catalog states the download's limitations.

## Verify this package

With Node 20 or newer, from the exported package:

```sh
node validate-resources.mjs catalog.json .
node verify-package.mjs
```

`checksums.json` lists every exported file's byte length and SHA-256, plus resource versions. It is an integrity manifest, not a cryptographic publisher signature. Review the release source before trusting a downloaded package.

Current verification status records review and file validation. It does not certify every client installation or account-specific workflow. This is the separate RocketLauncher resource library. It contains no website backend or Brain configuration.

See CONTRIBUTING.md for corrections, CREDITS.md for source boundaries, and RELEASING.md for publication and rollback.

## Claude community directory

`claude-directory/catalog.json` indexes the attributed community collection from [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates), pinned to commit `ed9fc5db53277a96b20ccf8a45dd74b9f405cd38`. This imported collection is separate from the six original RocketLauncher resources in the root catalog. Individual entries state their author, source, applicable license, compatibility and verification status. Imported does not mean installed or runtime-tested.

Download an entry's archive from `claude-directory/downloads/`. Website paths beginning `/claude-directory/` correspond to that directory here. Archives include upstream attribution and applicable license notices. Inspect all files before using them; hooks, plugins, MCP configurations and skills can have different permissions and dependencies. No imported code runs as part of this library.

Restricted or unclear component licenses remain source links only. The root MIT license covers RocketLauncher's original files, not every imported component. Respect the notices inside each archive. This collection is not an official Anthropic product or endorsement.
