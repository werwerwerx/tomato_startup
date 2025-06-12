import { ClipboardListIcon } from "lucide-react"

export const ListOrders = () => {
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
  )
}