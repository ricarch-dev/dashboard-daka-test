import axios from "axios";
import type { Category } from "@/types";

/**
 * API service para manejo de categorías
 */

const API_BASE_URL = "https://fakestoreapi.com";

// Categorías fallback en caso de error
const FALLBACK_CATEGORIES: Category[] = [
  "electronics",
  "jewelery",
  "men's clothing",
  "women's clothing",
];

/**
 * Obtiene todas las categorías disponibles
 * @returns {Promise<Category[]>} Lista de categorías
 */
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get<Category[]>(
      `${API_BASE_URL}/products/categories`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    console.warn("Using fallback categories");
    return FALLBACK_CATEGORIES;
  }
};
