export interface DishPreview {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export const dishesApi = {
  getDishes: async (): Promise<DishPreview[]> => {
    try {
      const dishes = await import("./dishes.repository");
      return dishes.getDishes();
    } catch (error) {
      throw new Error("Failed to fetch dishes");
    }
  },
}; 