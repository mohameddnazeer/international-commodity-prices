import axios from "axios";

export const externalApi = axios.create({
  baseURL: "http://app.prices.idsc.gov.eg/api/PricesData",
  timeout: 15000,
});

export const internalApi = axios.create({
  baseURL: "/api",
  timeout: 15000,
});
