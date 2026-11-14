# Studio CRM in a container, for people who already run Docker.
# Studios on a normal Windows or Mac computer should use the ready-to-run download instead.
FROM node:22-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY . .
ENV PORT=3000
EXPOSE 3000 3443
# The studio's data: the SQLite file in /app/data, and the scans and backups in /app/storage.
# Mount a volume on each, or they are lost when the container is replaced.
VOLUME /app/data
VOLUME /app/storage
CMD ["node", "server.js"]
