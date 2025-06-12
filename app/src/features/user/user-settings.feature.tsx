export const UserSettings = () => {
  return (<div className="space-y-4">
    <UserAdress />
    {/* Уведомления */}
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <BellIcon className="text-foreground h-4 w-4" />
        <h4 className="text-foreground text-base font-semibold">
          Уведомления
        </h4>
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p className="text-foreground/80 text-sm">
          Присылать уведомления о заказах
        </p>
        <button
          onClick={() => setNotifications(!notifications)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            notifications ? "bg-primary" : "bg-foreground/30",
          )}
        >
          <span
            className={cn(
              "bg-background inline-block h-4 w-4 transform rounded-full transition-transform",
              notifications
                ? "translate-x-6"
                : "translate-x-1",
            )}
          />
        </button>
      </div>
    </div>)
}