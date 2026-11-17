#!/bin/bash
set -euo pipefail
trap 'printf "CGROUP_PEAK_BYTES="; cat /sys/fs/cgroup/memory.peak; printf "CGROUP_EVENTS="; cat /sys/fs/cgroup/memory.events' EXIT
node -e 'const f=require("fs"); const s=f.readFileSync("/proc/meminfo","utf8"); const k=Number(s.match(/^MemAvailable:\s+(\d+)/m)[1]); console.log("LINUX_MEMAVAILABLE_KIB="+k); if(k<3328*1024) process.exit(2); console.log("CGROUP_MAX="+f.readFileSync("/sys/fs/cgroup/memory.max","utf8").trim()); console.log("CGROUP_SWAP_MAX="+f.readFileSync("/sys/fs/cgroup/memory.swap.max","utf8").trim())'
mkdir -p /workspace /artifacts
# Explicit source allowlist; never copy host deps/build caches or environment files.
tar -C /source --exclude=node_modules --exclude=.next --exclude=dist --exclude=.pnpm-store \
  --exclude='*.tsbuildinfo' --exclude='.env*' -cf - \
  package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json apps services packages |
  tar -C /workspace -xf -
cd /workspace
npm install --prefix /opt/pnpm --ignore-scripts --no-audit --no-fund pnpm@11.5.0
export PATH="/opt/pnpm/node_modules/.bin:$PATH"
export CI=true npm_config_ignore_scripts=true
export NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=768 RAYON_NUM_THREADS=1 UV_THREADPOOL_SIZE=2
pnpm install --frozen-lockfile --ignore-scripts
pnpm -r --workspace-concurrency=1 build
deployRoot="/deploy/attempt-$(date -u +%Y%m%dT%H%M%S%N)"
test ! -e "$deployRoot"
mkdir -p "$deployRoot"
for service in gateway catalog community notification; do
  pnpm --config.ignore-scripts=true --filter "@grabmefood/$service" deploy --prod --legacy "$deployRoot/$service"
  test -f "$deployRoot/$service/dist/main.js"
  tar -C "$deployRoot/$service" -cf "/artifacts/$service.tar" .
done
test -f apps/web/.next/standalone/apps/web/server.js
cp -a apps/web/.next/static apps/web/.next/standalone/apps/web/.next/static
tar -C apps/web/.next/standalone -cf /artifacts/web.tar .
cp /source/scripts/container-liveness.mjs /artifacts/container-liveness.mjs
echo BOUNDED_BUILD_COMPLETE
