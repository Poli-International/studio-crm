# Studio CRM in a container, for people who already run Docker.
# Studios on a normal Windows or Mac computer should use the ready-to-run download instead.
FROM node:22-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY . .
ENV PORT=3000
EXPOSE 3000
# All studio data is the SQLite file in /app/data: mount a volume there.
VOLUME /app/data
CMD ["node", "server.js"]
