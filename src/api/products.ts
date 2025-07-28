import axios from "axios";
import { formatUSDPrice, formatVenezuelanPrice } from "@/utils/formatters";
import type { Product, RawProduct } from "@/types";

/**
 * API service para manejo de productos
 */

const API_BASE_URL = "https://fakestoreapi.com";

/**
 * Obtiene todos los productos de la API
 * @returns {Promise<Product[]>} Lista de productos formateados
 */
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<RawProduct[]>(`${API_BASE_URL}/products`);
    const products = response.data;

    return products.map(
      (product: RawProduct): Product => ({
        id: product.id,
        name: product.title,
        href: "#",
        imageSrc: product.image,
        imageAlt: product.title,
        price: formatUSDPrice(product.price),
        priceValue: product.price,
        priceVES: "0", // Se calcula posteriormente con la tasa
        color: product.category,
        category: product.category,
        description: product.description,
      })
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("No se pudieron cargar los productos");
  }
};

/**
 * Actualiza los precios VES de los productos según la tasa de cambio
 * @param {Product[]} products - Lista de productos
 * @param {number} dollarRate - Tasa de cambio USD/VES
 * @returns {Product[]} Productos con precios VES actualizados
 */
export const updateProductsPricesVES = (
  products: Product[],
  dollarRate: number
): Product[] => {
  return products.map(
    (product: Product): Product => ({
      ...product,
      priceVES: formatVenezuelanPrice(product.priceValue * dollarRate),
    })
  );
};
