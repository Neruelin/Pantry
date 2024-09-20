import { getPantryServiceHandler } from "@com.example/coffee-shop-server";
import { IncomingMessage, ServerResponse, createServer } from "http";
import { convertRequest, writeResponse } from "@aws-smithy/server-node";
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

import { Pantry, PantryContext } from "./Pantry";
import Constants from "./constants";

function main() {

  const serviceHandler = getPantryServiceHandler(new Pantry());

  class PantryContextClass {
    context: PantryContext;
    constructor() {
      this.context = { counts: new Map() };
    }
    replacer(key, value) {
      if (value instanceof Map) {
        return {
          dataType: 'Map',
          value: Array.from(value.entries()), // or with spread: value: [...value]
        };
      } else {
        return value;
      }
    }
    reviver(key, value) {
      if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
          return new Map(value.value);
        }
      }
      return value;
    }
    readStateFromDisk() {
      if (existsSync(Constants.DATA_FILE_PATH)) {
        try {
          console.log("reading pantry.json.");
          const pantryJsonStr: string = readFileSync(Constants.DATA_FILE_PATH).toString();
          const pantryMap: Map<string, number> = JSON.parse(pantryJsonStr, this.reviver);
          this.context.counts = pantryMap
          console.log(ctx);
        } catch (err) {
          console.error("failed to read/parse pantryJson");
        }
      }
    }
    writeStateToDisk() {
      const pantryJsonStr = JSON.stringify(this.context.counts, this.replacer);
      try {
        console.log(pantryJsonStr);
        writeFileSync(Constants.DATA_FILE_PATH, pantryJsonStr);
        console.log("pantry.json updated.")
      } catch (err) {
        console.error("failed to write to pantry.json");
      }
    }
  }

  const ctx: PantryContextClass = new PantryContextClass();

  ctx.readStateFromDisk();

  setInterval(() => {
    ctx.writeStateToDisk();
  }, 7000);

  // Create the node server with the service handler
  const server = createServer(async function (
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage }
  ) {
    // Convert NodeJS's http request to an HttpRequest.
    const httpRequest = convertRequest(req);

    if (httpRequest.method == "OPTIONS") {
      res.writeHead(200, {"access-control-allow-origin": "*", "Access-Control-Allow-Headers": req.headers["access-control-request-headers"]});
      res.end();
      return;
    }

    // Call the service handler, which will route the request to the GreetingService
    // implementation and then serialize the response to an HttpResponse.
    const httpResponse = await serviceHandler.handle(httpRequest, ctx.context);
    
    // Write the HttpResponse to NodeJS http's response expected format.
    res.setHeader("Access-Control-Allow-Origin", "*");
    return writeResponse(httpResponse, res);
  });

  const port = 3001
  server.listen(port);
  console.log(`Started server on port ${port}...`);
}

main();