export default (params: Params) =>
  typeof params === "string" ? params : params[0];
