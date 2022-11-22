import _ from "lodash";

const appEnv = process.env.APP_ENV || process.env.NODE_ENV || "development";
if (!appEnv) {
  throw new Error("No APP_ENV or NODE_ENV environment variable set");
}

const config = _.merge(
  require("../../config/default"),
  require(`../../config/${appEnv}`)
);

export default config.default;
