"use client"

import { usePathname } from "next/navigation"
import Sidebar from "./components/Sidebar"

export default function CRMLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Hide sidebar on login page
  const isLoginPage = pathname === "/crm/login"

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  )
}