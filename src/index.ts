import { app } from "./app";
import { config } from "./config";

app.listen(config.port, () => {
  console.log(`financeiro-auth listening on port ${config.port}`);
});
