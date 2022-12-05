import { createServer } from './utils/createServer';
import { logger } from './utils/logger';
import { config } from './utils/config';
import { connectToDb, disconnectDb } from './utils/db';

const signals = ["SIGINT", "SIGTERM", "SIGHUP"] as const;

async function gracefulShutDown({
  signal,
  server,
}: {
  signal: typeof signals[number];
  server: Awaited<ReturnType<typeof createServer>>;
}) {
  logger.info(`Got a signal ${signal}. Good bye.`);
  await server.close();
  await disconnectDb();
  process.exit(0);
}

async function startServer() {
  const server = await createServer();

  server.listen({
    port: config.PORT,
    host: config.HOST,
  });

  await connectToDb();

  logger.info("App is running!");

  for (let i = 0; i < signals.length; i++) {
    process.on(signals[i], () =>
      gracefulShutDown({
        signal: signals[i],
        server
      })
    )
  }
}

startServer();