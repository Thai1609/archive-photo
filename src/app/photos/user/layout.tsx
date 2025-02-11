"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function ProfilePageLayout({ children }) {
  const links = [
    { name: "Account", href: "/photos/user" },
    { name: "Security", href: "/photos/user/security" },
    { name: "Contact", href: "/photos/user/contact" },
  ];

  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-1/4 bg-white my-12 mx-6 border border-gray-300 rounded-lg shadow p-6">
          <h1 className="text-xl font-semibold mb-4">Settings</h1>

          <nav aria-label="Settings Navigation">
            <ul>
              {links.map(({ name, href }) => {
                const isActive = pathname === href;
                return (
                  <li key={name} className="mb-2">
                    <Link
                      href={href}
                      className={`flex items-center space-x-2 p-2 rounded transition-colors duration-300 ${
                        isActive
                          ? "bg-slate-500 text-white"
                          : "hover:bg-slate-500 hover:text-white"
                      }`}
                    >
                      {name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-6 bg-white my-12 mr-6 border border-gray-300 rounded-lg shadow">
          {children}
        </main>
      </div>
    </div>
  );
}
