"use client";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch("/api/logout", { method: "POST" });
    if (res.ok) {
      // Sau khi đăng xuất, chuyển hướng đến trang đăng nhập
      router.push("/auth/login");
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Đăng xuất</button>
    </div>
  );
}
