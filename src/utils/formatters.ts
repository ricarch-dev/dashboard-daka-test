import type { VenezuelanFormatOptions } from "@/types";

/**
 * Formatea un número al estilo venezolano para precios
 * @param {number} value - El valor numérico a formatear
 * @param {VenezuelanFormatOptions} options - Opciones de formateo
 * @returns {string} - Número formateado al estilo venezolano
 */
export const formatVenezuelanPrice = (
  value: number,
  options?: VenezuelanFormatOptions
): string => {
  const {
    currency = "Bs.",
    decimals = 2,
    showCurrency = true,
    showDecimals = true,
  } = options || {};

  if (value === null || value === undefined || isNaN(value)) {
    return showCurrency ? `${currency} 0,00` : "0,00";
  }

  const numValue = Number(value);

  // Formatear con separadores venezolanos
  const formatted = numValue.toLocaleString("es-VE", {
    minimumFractionDigits: showDecimals ? decimals : 0,
    maximumFractionDigits: showDecimals ? decimals : 0,
  });

  return showCurrency ? `${currency} ${formatted}` : formatted;
};

/**
 * Formatea un precio en USD al estilo estadounidense (punto decimal)
 * @param {number} value - El valor en USD
 * @returns {string} - Precio formateado ($25.99)
 */
export const formatUSDPrice = (value: number): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return "$0.00";
  }

  const numValue = Number(value);
  // Usar formato estadounidense para USD (punto decimal)
  const formatted = numValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `$${formatted}`;
};

/**
 * Formatea la tasa de cambio USD/VES
 * @param {number} rate - La tasa de cambio
 * @returns {string} - Tasa formateada
 */
export const formatExchangeRate = (rate: number): string => {
  return formatVenezuelanPrice(rate, {
    currency: "Bs.",
    decimals: 2,
    showCurrency: true,
  });
};

/**
 * Formatea números grandes con separadores venezolanos (sin decimales)
 * @param {number} value - El valor numérico
 * @returns {string} - Número formateado
 */
export const formatLargeNumber = (value: number): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return "0";
  }

  return Number(value).toLocaleString("es-VE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
