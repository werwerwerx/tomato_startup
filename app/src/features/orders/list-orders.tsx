import { ClipboardListIcon, Clock, Check, X, Package } from "lucide-react";
import { useOrders } from "./use-orders";
import { Button } from "@/shared/components/ui-kit/button";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "completed":
      return <Check className="h-4 w-4 text-green-500" />;
    case "cancelled":
      return <X className="h-4 w-4 text-red-500" />;
    default:
      return <Package className="h-4 w-4 text-blue-500" />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "В обработке";
    case "completed":
      return "Выполнен";
    case "cancelled":
      return "Отменён";
    default:
      return "В работе";
  }
};

export const ListOrders = () => {
  const { orders, ordersCount, isLoading } = useOrders();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="mt-2 text-sm text-gray-500">Загрузка заказов...</p>
      </div>
    );
  }

  if (ordersCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ClipboardListIcon className="mb-4 h-16 w-16 text-gray-300" />
        <h3 className="mb-2 text-lg font-semibold text-gray-600">
          Вы пока не делали заказы
        </h3>
        <p className="max-w-sm text-sm text-gray-500">
          Добавьте блюда в корзину и оформите ваш первый заказ
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Заказы ({ordersCount})</h3>
      </div>

      <div className="grid gap-4">
        {orders.map((order, index) => (
          <OrderItem key={`order-${order.id}-${index}`} order={order} />
        ))}
      </div>
    </div>
  );
};

interface OrderItemProps {
  order: {
    id: string;
    status: string;
    totalAmount: number;
    deliveryAddress: string;
    createdAt: Date;
    items: Array<{
      id: string;
      dishId: number;
      quantity: number;
      price: number;
      dish: {
        id: number;
        name: string;
        description: string;
        image: string;
      };
    }>;
  };
}

const OrderItem = ({ order }: OrderItemProps) => {
  const isOptimistic = order.id.startsWith('temp-');
  
  return (
    <div className={`rounded-lg border bg-white p-4 transition-shadow hover:shadow-sm ${
      isOptimistic ? 'border-dashed border-yellow-300 bg-yellow-50' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon(order.status)}
            <span className="text-sm font-medium">
              {getStatusText(order.status)}
            </span>
            {isOptimistic && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                Обрабатывается...
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-1">
            Заказ #{order.id.substring(0, 8)}...
          </p>
          
          <p className="text-sm text-gray-600 mb-2">
            Адрес доставки: {order.deliveryAddress}
          </p>
          
          <p className="text-sm font-semibold text-emerald-600">
            Сумма: {order.totalAmount}₽
          </p>
          
          <p className="text-xs text-gray-500 mt-2">
            {new Date(order.createdAt).toLocaleString('ru-RU')}
          </p>
        </div>
      </div>

      {order.items && order.items.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Состав заказа:</h4>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 text-sm">
                <div className="h-10 w-10 overflow-hidden rounded bg-gray-100">
                  {item.dish.image ? (
                    <img
                      src={item.dish.image}
                      alt={item.dish.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-lg">🍽️</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.dish.name}</p>
                  <p className="text-gray-500">
                    {item.quantity} × {item.price}₽ = {item.quantity * item.price}₽
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
