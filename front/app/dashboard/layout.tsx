"use client"

import { useState } from 'react';
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
        <div className={`flex h-screen bg-gray-200 font-roboto ${sidebarOpen ? 'overflow-hidden' : ''}`}>
            {/* <SideBar /> */}

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onSidebarOpen={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <div className="container mx-auto px-6 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
