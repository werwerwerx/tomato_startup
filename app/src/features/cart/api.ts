export const addToCart = async ({
  dishId,
  quantity,
}: {
  dishId: number;
  quantity: number;
}) => {
  const response = await fetch("/api/user/cart/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dishId, quantity }),
  });
  return response.json();
};

export const syncCart = async (
  items: Array<{ dishId: number; quantity: number }>,
) => {
  const response = await fetch("/api/user/cart/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  return response.json();
};
