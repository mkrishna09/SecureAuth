import "dotenv/config";

import app from "./app";
import config from "./config/env";
import logger from "./logger/logger";

app.listen(config.port, () => {
  logger.info(
    `SecureAuth server running in ${config.nodeEnv} mode on port ${config.port}`
  );
});