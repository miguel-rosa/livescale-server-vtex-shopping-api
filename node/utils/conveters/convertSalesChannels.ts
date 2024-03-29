import { SallesChannels } from "../../typings/clients";

export default (salesChannels: SallesChannels[]) =>
  salesChannels.map(({ CurrencyCode, CurrencySymbol, Name }) => ({
    Name,
    CurrencyCode,
    CurrencySymbol
  }));
