import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
    config: {
    callbackUrl: "https://turbine-squeak-pregnant.ngrok-free.dev",
  },
  // Apply an (optional) custom config:
  // config: { ... },
});
