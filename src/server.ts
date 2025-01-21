import { ExpressApp } from "./express-app";
import { logger } from "./utils";

const PORT = process.env.APP_PORT || 9000;

export const StartServer = async () => {
  const expressApp = await ExpressApp();
  expressApp.listen(PORT, () => {
    // console.log(`App is listening to ${PORT}`);
    logger.info(`App is listening to ${PORT}`);
  });

  process.on("uncaughtException", async (err) => {
    // console.log(err)
    logger.error(err);
    process.exit(1);
  });
};

StartServer().then(() => {
  // console.log("order_service server is up")
  logger.info("order_service server is up");
});
