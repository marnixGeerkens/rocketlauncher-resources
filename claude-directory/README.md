# Claude Code community collection

Source: https://github.com/davila7/claude-code-templates
Reference directory: https://aitmpl.com/skills/
Pinned commit: ed9fc5db53277a96b20ccf8a45dd74b9f405cd38

This is a source distribution, not a set of runtime-tested integrations. No downloaded code was installed or executed. Upstream descriptions remain in English. Component names, versions, authors and original source links are in catalog.json. A commit is used when upstream does not declare a version. Counts refer to actual component entry points, not auxiliary files. A plugin marketplace manifest is configuration, not an extra installed plugin.

Each downloadable ZIP contains the upstream component, required supporting files, root license and applicable component licenses, plus a provenance manifest with per-file SHA-256. ZIP packaging and provenance are additions; source contents are unmodified. Generated database journals are omitted and named in the manifest. Root MIT terms do not override more restrictive component terms. Restricted document skills and entries with missing referenced license terms are source-link-only. CC-BY-4.0 entries retain original credits and license link. Upstream remains responsible for its source attribution; report suspected rights issues before redistribution.

## Use

1. Download one ZIP and inspect it in a separate folder.
2. Read the source entry and any README, permissions and compatibility requirements.
3. Follow the upstream installation instructions for that component type. ZIPs are not automatic installers.
4. Replace placeholders yourself; never commit credentials. MCP servers may require external packages/accounts. Mods, hooks and sandbox scripts can run code when enabled. Review before enabling.

Claude Code assets are not automatically compatible with Codex, ChatGPT or GoHighLevel. Publication does not establish operational compatibility, safety or provider access.

## Reproduce in the RocketLauncher site checkout

Use a clean read-only clone of the upstream repository at the pinned commit. Do not run upstream installers, lifecycle scripts or plugins.

    git clone --filter=blob:none --sparse https://github.com/davila7/claude-code-templates.git output/claude-upstream/repo
    git -C output/claude-upstream/repo sparse-checkout set cli-tool/components
    git -C output/claude-upstream/repo checkout ed9fc5db53277a96b20ccf8a45dd74b9f405cd38
    node scripts/import-claude-directory.mjs output/claude-upstream/repo public/claude-directory
    node --test scripts/test-claude-directory.mjs

The importer uses only Node built-ins and local Git reads. It checks the commit, refuses symlinks and unsafe paths, applies component license overrides and produces deterministic ZIPs. Updating the snapshot requires review of source changes and licensing, then changing the explicit commit. Publication remains a separate action.
