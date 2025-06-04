import AuthForm from "@/features/auth";

export default function AuthPage() {
  return (
    <div className="flex h-[70vh] md:h-[70vh] lg:h-screen xl:h-[90vh] w-full items-center justify-center">
      <AuthForm />
    </div>
  );
}
