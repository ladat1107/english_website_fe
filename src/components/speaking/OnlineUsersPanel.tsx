/**
 * Khailingo - Online Users Panel Component
 * Hiển thị danh sách người đang làm cùng đề và link Google Meet
 */

"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Video, Copy, Check, ExternalLink, Wifi } from 'lucide-react';
import { cn } from '@/utils/cn';
import { OnlineUser } from '@/types/speaking.type';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import Image from 'next/image';

// =====================================================
// TYPES
// =====================================================
interface OnlineUsersPanelProps {
    users: OnlineUser[];
    googleMeetLink?: string;
    className?: string;
    isCollapsible?: boolean;
    defaultExpanded?: boolean;
}

// =====================================================
// HELPER - Random pulse animation delay
// =====================================================
const getRandomDelay = () => Math.random() * 2;

// =====================================================
// ONLINE USERS PANEL COMPONENT
// =====================================================
export function OnlineUsersPanel({
    users,
    googleMeetLink,
    className,
    isCollapsible = true,
    defaultExpanded = true,
}: OnlineUsersPanelProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const [isCopied, setIsCopied] = useState(false);

    // Copy link to clipboard
    const copyMeetLink = async () => {
        if (!googleMeetLink) return;

        try {
            await navigator.clipboard.writeText(googleMeetLink);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <Card className={cn('overflow-hidden sticky top-28 ', className)}>
            {/* Header */}
            <CardHeader
                className={cn(
                    'flex flex-row items-center justify-between space-y-0 pb-2',
                    isCollapsible && 'cursor-pointer hover:bg-muted/50 transition-colors'
                )}
                onClick={() => isCollapsible && setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Users className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">
                        Đang luyện tập cùng bạn
                    </CardTitle>
                </div>
                <Badge variant="secondary" className="gap-1">
                    <Wifi className="w-3 h-3" />
                    {users.length} online
                </Badge>
            </CardHeader>

            {/* Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <CardContent className="pt-0">
                            {/* User List */}
                            {users.length > 0 ? (
                                <div className="space-y-3 mb-4">
                                    {users.map((user, index) => (
                                        <motion.div
                                            key={user.user_id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center gap-3"
                                        >
                                            {/* Avatar */}
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                                                    {user.avatar_url ? (
                                                        <Image
                                                            src={user.avatar_url}
                                                            alt={user.user_name}
                                                            width={40}
                                                            height={40}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-muted-foreground">
                                                            {user.user_name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Online dot */}
                                                <motion.span
                                                    className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-card rounded-full"
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        delay: getRandomDelay()
                                                    }}
                                                />
                                            </div>

                                            {/* User Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {user.user_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Đang luyện tập
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted-foreground text-sm">
                                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    Chưa có ai đang luyện tập
                                </div>
                            )}

                            {/* Google Meet Link */}
                            {googleMeetLink && (
                                <div className="pt-4 border-t border-border">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Video className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-medium">
                                            Luyện nói nhóm qua Google Meet
                                        </span>
                                    </div>

                                    {/* Meet Link Box */}
                                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                                        <input
                                            type="text"
                                            value={googleMeetLink}
                                            readOnly
                                            className="flex-1 bg-transparent text-sm text-muted-foreground truncate border-none outline-none"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={copyMeetLink}
                                            title="Sao chép link"
                                        >
                                            {isCopied ? (
                                                <Check className="w-4 h-4 text-success" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>

                                    {/* Join Button */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full mt-3 gap-2"
                                        onClick={() => window.open(googleMeetLink, '_blank')}
                                    >
                                        <Video className="w-4 h-4" />
                                        Tham gia Google Meet
                                        <ExternalLink className="w-3 h-3" />
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}

export default OnlineUsersPanel;
