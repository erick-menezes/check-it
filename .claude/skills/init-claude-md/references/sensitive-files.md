# Sensitive Files Denylist

Never open (Read/Grep/cat) any file matching the patterns below during research or while
composing `CLAUDE.md`. Never copy the contents or any secret value of these files into the
documentation. If a candidate file matches, skip it silently and use a safe alternative.

## Never read

| Pattern | Why |
| ------- | --- |
| `.env`, `.env.*` (e.g. `.env.local`, `.env.production`) | Runtime secrets, API keys, DB credentials |
| `*.pem`, `*.key`, `*.crt`, `*.cer`, `*.der` | Private keys / certificates |
| `*.p12`, `*.pfx`, `*.jks`, `*.keystore`, `*.truststore` | Key/certificate stores |
| `id_rsa`, `id_dsa`, `id_ecdsa`, `id_ed25519`, `*.ppk` | SSH private keys |
| `secrets*`, `*secret*`, `credentials*`, `*credential*` | Credential bundles |
| `*.tfstate`, `*.tfstate.backup` | Terraform state (often contains secrets) |
| `*-service-account*.json`, `gcp-*.json`, `*serviceaccount*.json` | Cloud service-account keys |
| `.npmrc`, `.pypirc`, `.netrc`, `.htpasswd` | Registry / auth tokens |
| `*.kdbx`, `*.agekey`, `*.gpg`, `*.asc` (private) | Password stores / encryption keys |
| Files under `secrets/`, `private/`, `.ssh/`, `.gnupg/` | Secret-bearing directories |

## Safe alternatives

- Read `.env.example`, `.env.sample`, or `.env.template` to learn the **names** of expected
  environment variables — never their values.
- Read manifest files (`package.json`, `pyproject.toml`, `go.mod`, etc.) for stack and commands;
  these are safe.
- Honor `.gitignore`: paths ignored for secret reasons (keys, env files, local config) should be
  treated as sensitive even if not listed above.

## Rules of thumb

- If a filename or path suggests it holds a secret, token, key, certificate, or credential, do
  not open it.
- When in doubt, skip the file and note in the report that it was skipped for safety.
- Never reproduce a secret value in `CLAUDE.md`, even if it was seen incidentally.
