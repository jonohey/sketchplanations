import { execFileSync } from "node:child_process";
import {
	chmodSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

const script = fileURLToPath(
	new URL(
		"../../.github/scripts/resolve-dependabot-lockfile-conflicts.sh",
		import.meta.url,
	),
);

const roots = [];

const packageJson = (dependencyVersion, scriptCommand) => `{
  "name": "fixture",
  "scripts": {
    "start": "${scriptCommand}"
  },
  "dependencies": {
    "left-pad": "${dependencyVersion}"
  },
  "pnpm": {
    "overrides": {
      "example": "1.0.0"
    }
  }
}
`;

function makeRepo() {
	mkdirSync(join(process.cwd(), "node_modules", ".cache"), {
		recursive: true,
	});
	const parent = mkdtempSync(
		join(process.cwd(), "node_modules", ".cache", "lockfile-conflict-"),
	);
	const root = join(parent, "repo");
	const bin = join(parent, "bin");
	mkdirSync(root);
	mkdirSync(bin);
	writeFileSync(
		join(bin, "pnpm"),
		`#!/bin/sh
if [ ! -f lock-before.txt ]; then
  cp pnpm-lock.yaml lock-before.txt
fi
cat > pnpm-lock.yaml << 'EOF'
lockfileVersion: '9.0'

overrides:
  example: 1.0.0

importers:
  .:
EOF
`,
	);
	chmodSync(join(bin, "pnpm"), 0o755);
	roots.push(parent);

	const env = {
		...process.env,
		PATH: `${bin}:${process.env.PATH}`,
		GIT_AUTHOR_NAME: "Test",
		GIT_AUTHOR_EMAIL: "test@example.com",
		GIT_COMMITTER_NAME: "Test",
		GIT_COMMITTER_EMAIL: "test@example.com",
	};

	const git = (args, cwd = root) => {
		execFileSync("git", args, { cwd, env });
	};

	const template = join(parent, "git-template");
	mkdirSync(template);
	git(["init", "-b", "main", `--template=${template}`]);
	writeFileSync(join(root, "package.json"), packageJson("^1.0.0", "echo base"));
	writeFileSync(join(root, "pnpm-lock.yaml"), "lockfile: base\n");
	git(["add", "package.json", "pnpm-lock.yaml"]);
	git(["commit", "-m", "base"]);

	return { root, env, git };
}

afterEach(() => {
	while (roots.length > 0) {
		rmSync(roots.pop(), { recursive: true, force: true });
	}
});

describe("resolve-dependabot-lockfile-conflicts", () => {
	it("refreshes a lockfile-only conflict and keeps the PR pin", () => {
		const { root, env, git } = makeRepo();

		git(["checkout", "-b", "dependabot"]);
		writeFileSync(
			join(root, "package.json"),
			packageJson("^1.2.0", "echo base"),
		);
		writeFileSync(join(root, "pnpm-lock.yaml"), "lockfile: dependabot pin\n");
		git(["add", "package.json", "pnpm-lock.yaml"]);
		git(["commit", "-m", "bump left-pad"]);

		git(["checkout", "main"]);
		writeFileSync(
			join(root, "package.json"),
			packageJson("^1.0.0", "echo main"),
		);
		writeFileSync(join(root, "pnpm-lock.yaml"), "lockfile: main\n");
		git(["add", "package.json", "pnpm-lock.yaml"]);
		git(["commit", "-m", "main moves the lockfile"]);

		git(["checkout", "dependabot"]);
		const output = execFileSync("bash", [script, "--current", "main"], {
			cwd: root,
			env,
			encoding: "utf8",
		});

		expect(output).toContain("resolved:");
		expect(readFileSync(join(root, "lock-before.txt"), "utf8")).toBe(
			"lockfile: dependabot pin\n",
		);
		expect(readFileSync(join(root, "package.json"), "utf8")).toContain(
			'"left-pad": "^1.2.0"',
		);
		expect(readFileSync(join(root, "package.json"), "utf8")).toContain(
			'"start": "echo main"',
		);
		expect(readFileSync(join(root, "pnpm-lock.yaml"), "utf8")).toContain(
			"overrides:",
		);
		expect(
			execFileSync("git", ["log", "-1", "--format=%s"], {
				cwd: root,
				env,
				encoding: "utf8",
			}),
		).toBe("Resolve pnpm lockfile conflict with main\n");
	});

	it("leaves a package.json conflict untouched", () => {
		const { root, env, git } = makeRepo();

		git(["checkout", "-b", "dependabot"]);
		writeFileSync(
			join(root, "package.json"),
			packageJson("^1.2.0", "echo base"),
		);
		writeFileSync(join(root, "pnpm-lock.yaml"), "lockfile: dependabot pin\n");
		git(["add", "package.json", "pnpm-lock.yaml"]);
		git(["commit", "-m", "bump left-pad"]);

		git(["checkout", "main"]);
		writeFileSync(
			join(root, "package.json"),
			packageJson("^1.1.0", "echo base"),
		);
		writeFileSync(join(root, "pnpm-lock.yaml"), "lockfile: main\n");
		git(["add", "package.json", "pnpm-lock.yaml"]);
		git(["commit", "-m", "main also bumps left-pad"]);

		git(["checkout", "dependabot"]);
		const before = execFileSync("git", ["rev-parse", "HEAD"], {
			cwd: root,
			env,
			encoding: "utf8",
		});
		const output = execFileSync("bash", [script, "--current", "main"], {
			cwd: root,
			env,
			encoding: "utf8",
		});

		expect(output).toContain("skipped: conflicts are not lockfile-only");
		expect(output).toContain("package.json");
		expect(
			execFileSync("git", ["rev-parse", "HEAD"], {
				cwd: root,
				env,
				encoding: "utf8",
			}),
		).toBe(before);
		expect(
			execFileSync("git", ["status", "--porcelain"], {
				cwd: root,
				env,
				encoding: "utf8",
			}),
		).toBe("");
	});
});
