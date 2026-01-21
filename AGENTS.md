AGENTS

Purpose
- This file tells agentic contributors how to build, lint, test and follow code style in this repository.
- If the repository contains framework- or language-specific files, prefer the commands and conventions that match detected files.

Quick detection steps for agents
- Look for language indicators in the repo root: `package.json`, `pnpm-lock.yaml`, `bun.lockb`, `pyproject.toml`, `requirements.txt`, `go.mod`, `Cargo.toml`, `Makefile`, `Dockerfile`.
- If multiple ecosystems are present, operate on the one controlling the current working directory or ask the human for direction.

Build / lint / test commands (common defaults)
- Node (npm / yarn / pnpm / bun):
  - Install dependencies: `npm ci` or `pnpm install` or `yarn install` or `bun install`
  - Build: `npm run build` (or `pnpm run build`, `yarn build`, `bun build`)
  - Dev / start: `npm run dev` or `npm start`
  - Lint: `npm run lint` (commonly `eslint .`)
  - Format: `npm run format` (commonly `prettier --write .`)
  - Test (all): `npm test` (often maps to `jest` / `vitest` / `mocha`)
  - Test (single):
    - Jest: `npx jest -t "Test name regex"` or `npm test -- -t "Test name regex"`
    - Vitest: `npx vitest -t "Test name"` or `pnpm vitest -t "Test name"`
    - Mocha: `npx mocha --grep "pattern"`

- Bun specific: `bun install`, `bun run build`, `bun test` (bun uses the `bun` binary; commands mirror npm scripts if defined).

- Python (venv / poetry):
  - Create venv: `python -m venv .venv` and `source .venv/bin/activate`
  - Install deps: `pip install -r requirements.txt` or `poetry install`
  - Lint: `flake8 .` or `ruff .`
  - Format: `black .` and `isort .`
  - Test (all): `pytest`
  - Test (single): `pytest path/to/test_file.py::test_name -q`

- Go:
  - Build: `go build ./...`
  - Test (all): `go test ./...`
  - Test (single): `go test -run TestName ./...` (use full regex)
  - Format / vet: `gofmt -w .` and `go vet ./...`

- Rust:
  - Build: `cargo build`
  - Test (all): `cargo test`
  - Test (single): `cargo test test_name`
  - Format: `cargo fmt`

- Other / generic:
  - If there is a `Makefile`, prefer `make build`, `make test`, `make lint` if targets exist.
  - For Docker-based projects: `docker build -t repo .` and use containerized test commands.

Finding and running a single test quickly
- Agents should look for the test framework declared in lockfiles or package metadata.
- Use the framework-specific `-t/--grep/-k` flags to target tests by name. When names are unknown, run a single file: `npm test -- path/to/testfile` or `pytest path/to/test_file.py::test_name`.
- For flaky tests, run with verbose and reproducible flags (e.g. `--runInBand` for Jest, `-q -k` for pytest) and capture logs.

Code style guidelines
- Formatting
  - Use project formatters when present: Prettier (JS/TS), Black (Python), gofmt (Go), rustfmt (Rust). Run the formatter before commit.
  - Keep editorconfig consistent: respect `.editorconfig` if present. If not present, prefer 2 spaces for JS/TS/JSON and 4 spaces for Python/Go unless the repo already uses another style.

- Imports
  - Group imports in this order: standard libs -> external dependencies -> internal modules -> styles/assets.
  - Leave a single blank line between groups.
  - In JS/TS prefer absolute imports from `src/` or configured path alias rather than deep relative chains (`../../../foo`). If path aliases exist in `tsconfig.json`, follow them.
  - Keep import statements sorted alphabetically within a group.

- Types (TypeScript / typed languages)
  - Prefer explicit types in public interfaces and exported functions. For local/internal code, use type inference when it improves readability.
  - Prefer `unknown` over `any` for values of unknown shape and narrow before use.
  - Use `readonly` on arrays/tuples where mutation is not intended.

- Naming
  - Variables & functions: `camelCase`
  - Types, interfaces, classes, React components: `PascalCase`
  - Constants: `UPPER_SNAKE_CASE` for compile-time constants; `camelCase` for module-scoped singletons.
  - Files: follow the majority style in the repo. If no style exists, use `kebab-case` for non-test files and `kebab-case.spec.ts` or `.test.ts` for tests.

- Files & Modules
  - Keep modules small and focused; 200-400 LOC is a practical upper bound for a single file in most codebases.
  - Export a single responsibility per module when practical (default export OK for a single main value; prefer named exports for libraries).

- Error handling
  - Do not swallow errors silently. Log or return error context.
  - In JS/TS: throw `Error` (or custom Error subclasses) with clear messages; include contextual fields (like `code`) when helpful.
  - In Go: return `error` as the last return value and use `fmt.Errorf("context: %w", err)` to wrap.
  - In Python: prefer raising specific exceptions and attach context using `raise NewExc(...) from exc` when wrapping.
  - Add tests for error paths where behavior matters.

- Concurrency & async
  - Prefer higher-level concurrency primitives (async/await, channels, worker pools) and avoid spinning threads/processes per request.
  - Always handle promise rejection / goroutine panics: in JS use `await` or attach `.catch`, in Go handle panics or recover at appropriate boundaries.

Testing conventions
- Tests should be deterministic and fast; prefer unit tests for logic and integration tests for cross-module contracts.
- Organize tests next to files (`foo.test.js`) or under a `tests/` directory; follow existing repo convention.
- Use fixtures and test factories to construct complex objects rather than large hand-written fixtures.
- For flaky or slow tests, mark them and isolate them in CI pipelines (e.g. `npm run test:integration`).

CI / pre-commit guidance for agents
- Respect defined CI configurations: `/.github/workflows/*`, `.gitlab-ci.yml`, etc. These define the expectations for linting and testing.
- Do not bypass pre-commit hooks. If a hook fails, fix the cause and re-run instead of skipping.
- Commit messages: use imperative present tense, short summary line, optionally a body. Example: `fix: handle null value in parseUser`.
- Never commit secrets or .env files. If you detect credentials, ask the user.

Cursor / Copilot rules
- If the repo contains Cursor rules, include them in agent decisions. Files to check:
  - `.cursor/rules/` (directory)
  - `.cursorrules` (file)
  - `.github/copilot-instructions.md` (file)
- Agents should read and incorporate these rules before making edits or generating code. If they exist, surface any constraints in the change summary.

How agents should operate (behavioural rules)
- Default: make non-destructive edits and include clear commit messages when asked to commit. Do not run destructive git commands.
- If unsure about high-impact choices (API changes, version bumps, or CI changes), make a small suggested change and ask one targeted question.
- Prefer creating small focused diffs with rationale in the PR description.

Troubleshooting tips
- If tests fail locally but pass in CI, compare node/python/rust versions and environment variables used by CI.
- For dependency issues, check lockfile (`package-lock.json`, `pnpm-lock.yaml`, `bun.lockb`, `poetry.lock`) for reproducible installs.

Useful commands for agents to inspect repo for rules and tooling
- `ls -la` to list files in the root
- `git status --porcelain` to see local changes (if repo is a git repo)
- `node -v && npm -v` or `python -V` to detect available runtimes

Contact & escalation
- If a change touches security, billing, or production deployment, stop and ask the repository owner for explicit approval.

Appendix: Single-test quick cheatsheet
- Jest: `npx jest path/to/file.test.ts -t "test name" --runInBand`
- Vitest: `npx vitest run path/to/file.test.ts -t "test name"`
- Mocha: `npx mocha path/to/file.test.ts --grep "pattern"`
- Pytest: `pytest tests/test_file.py::test_name -q`
- Go: `go test -run TestName ./...`
- Cargo: `cargo test test_name`

End
