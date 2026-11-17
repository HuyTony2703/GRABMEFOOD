# Runtime assembly only. Heavy install/build is executed in the capped build container.
# Linux-generated tar archives preserve Linux symlinks without Windows node_modules.
FROM docker.io/library/node:24.16.0-bookworm-slim@sha256:2c87ef9bd3c6a3bd4b472b4bec2ce9d16354b0c574f736c476489d09f560a203 AS runtime
ENV NODE_ENV=production HOST=0.0.0.0 CONTAINER_BIND=true
WORKDIR /app
ARG ARTIFACT
ADD --chown=node:node ${ARTIFACT}.tar /app/
COPY --chown=node:node container-liveness.mjs /app/container-liveness.mjs

FROM runtime AS nest-runtime
USER node
STOPSIGNAL SIGTERM
CMD ["node", "dist/main.js"]

FROM runtime AS web-runtime
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOST=0.0.0.0 HOSTNAME=0.0.0.0 CONTAINER_BIND=true PORT=3000
USER node
STOPSIGNAL SIGTERM
CMD ["node", "apps/web/server.js"]
