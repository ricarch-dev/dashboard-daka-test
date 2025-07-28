import axios from "axios";
import type { ExchangeRateResponse } from "@/types";

/**
 * API service para manejo de tasa de cambio
 */

const EXCHANGE_API_URL = "https://pydolarve.org/api/v1/dollar?page=bcv";
const DEFAULT_RATE: number = 36.5;

/**
 * Obtiene la tasa de cambio USD/VES actual
 * @returns {Promise<number>} Tasa de cambio USD/VES
 */
export const fetchExchangeRate = async (): Promise<number> => {
  try {
    const response = await axios.get<ExchangeRateResponse>(EXCHANGE_API_URL, {
      timeout: 5000, // 5 segundos timeout
    });

    const rate: number | undefined = response.data?.monitors?.usd?.price;

    if (rate && typeof rate === "number" && rate > 0) {
      return rate;
    }

    console.warn("Invalid exchange rate received, using default");
    return DEFAULT_RATE;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    console.warn(`Using default exchange rate: ${DEFAULT_RATE}`);
    return DEFAULT_RATE;
  }
};
