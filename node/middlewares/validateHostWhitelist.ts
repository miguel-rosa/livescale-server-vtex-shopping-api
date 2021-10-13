import { AuthenticationError } from "@vtex/api";
import * as config from "../config/global.json";

export default async function validateHostWhitelist(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    request: {
      headers: { "x-forwarded-host": host }
    }
  } = ctx;

  const { whitelistHosts } = config;

  if (
    whitelistHosts.some((whitelistHost: string) => whitelistHost.includes(host))
  ) {
    await next();
  } else {
    throw new AuthenticationError("Unauthorized");
  }
}
