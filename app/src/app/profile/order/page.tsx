import { ListCart } from "@/features/cart/list-cart";


export function OrderPage() {
  const {data: data } = useSession();
  return (
    <div>
      <ListCart/>
    </div>
  ) 
} 