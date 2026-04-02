"use client"

import Link from "next/link"
import Image from "next/image"
import { Users, MessageCircle, ArrowRight } from "lucide-react"
import envConfig from "@/utils/env-config"
import FreeLevelTestDialog from "../layout/FreeTestDialog"
import { useState } from "react"

const items = [
    {
        title: "Nhóm Zalo ",
        desc: "Tài liệu & chia sẻ miễn phí",
        icon: Users,
        variant: "zalo",
    },
    {
        title: "Test đầu vào miễn phí",
        desc: "Nhận lộ trình học phù hợp",
        icon: MessageCircle,
        variant: "test",
    },
]

export default function SidebarPromo() {

    const [openTestDialog, setOpenTestDialog] = useState(false);

    return (
        <aside className="w-full sticky top-24">
            <div className="space-y-4">

                {/* Cards */}
                {items.map((item, index) => {
                    const Icon = item.icon

                    if (item.variant === "zalo") {
                        return (
                            <div
                                key={index}
                                onClick={() => window.open(envConfig.NEXT_PUBLIC_ZALO_GROUP_URL, "_blank")}
                                className="group relative block overflow-hidden rounded-xl border-2 border-blue-600 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600"
                            >
                                <div className="relative flex items-center gap-3 rounded-xl bg-white/95 px-4 py-3">

                                    {/* HOT badge */}
                                    <span className="absolute top-2 right-2 text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                                        HOT
                                    </span>

                                    {/* Icon */}
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 shadow">
                                        <Icon size={20} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            {item.desc}
                                        </p>
                                    </div>

                                    {/* Arrow */}
                                    <ArrowRight className="text-blue-500 group-hover:translate-x-1 transition" size={18} />
                                </div>
                            </div>
                        )
                    }

                    // TEST CARD (khác style hoàn toàn)
                    return (
                        <div
                            key={index}
                            onClick={() => setOpenTestDialog(true)}
                            className="group relative flex items-center gap-3 rounded-xl px-4 py-3 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition overflow-hidden"
                        >
                            {/* Glow effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                                <div className="absolute -inset-[100%] bg-white/10 rotate-12 animate-[shine_2s_linear_infinite]" />
                            </div>

                            {/* FREE badge */}
                            <span className="absolute top-2 right-2 text-[10px] font-bold bg-white text-green-600 px-2 py-0.5 rounded-full">
                                FREE
                            </span>

                            {/* Icon */}
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
                                <Icon size={20} />
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <p className="text-sm font-semibold">
                                    {item.title}
                                </p>
                                <p className="text-xs text-white/90">
                                    {item.desc}
                                </p>
                            </div>

                            <ArrowRight className="group-hover:translate-x-1 transition" size={18} />
                        </div>
                    )
                })}

                {/* Banner */}
                <Link
                    href={envConfig.NEXT_PUBLIC_FACEBOOK_URL}
                    target="_blank"
                    className="block overflow-hidden group rounded-xl"
                >
                    <div className="relative w-full h-[400px]">
                        <Image
                            src="https://i.pinimg.com/736x/08/1a/34/081a345a04bc5b624e1c2220e47e8638.jpg"
                            alt="IELTS Banner"
                            fill
                            className="object-cover group-hover:scale-105 transition duration-500"
                        />
                    </div>
                </Link>

            </div>
            {openTestDialog && <FreeLevelTestDialog open={openTestDialog} onOpenChange={setOpenTestDialog} />}
        </aside>
    )
}