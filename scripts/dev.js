#!/usr/bin/env node
// Runs `next dev` and rewrites the URLs it prints to include the basePath,
// so the terminal shows e.g. http://localhost:3000/portfolio instead of a 404 root.
const { spawn } = require("child_process");
const { basePath = "" } = require("../next.config.js");

const child = spawn(
  process.execPath,
  [require.resolve("next/dist/bin/next"), "dev", ...process.argv.slice(2)],
  {
    stdio: ["inherit", "pipe", "inherit"],
    env: { ...process.env, FORCE_COLOR: process.env.FORCE_COLOR ?? "1" },
  }
);

// host:port not already followed by a path (ANSI color codes are fine)
const ORIGIN = /(https?:\/\/(?:localhost|[\d.]+|\[[^\]\s]+\]):\d+)(?![\w/])/g;

child.stdout.on("data", (chunk) => {
  const text = chunk.toString();
  process.stdout.write(basePath ? text.replace(ORIGIN, `$1${basePath}`) : text);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}
child.on("exit", (code) => process.exit(code ?? 0));
