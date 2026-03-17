"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiLayers } from "react-icons/fi";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllFlashcardDecks, useDeleteFlashcardDeck } from "@/hooks/use-flashcard";
import { PATHS } from "@/utils/constants";
import { ANIMATION_VARIANTS } from "@/utils/constants";
import { FLASHCARD_TOPIC_MEANINGS, FlashcardDeck, FlashCardParams, flashCardTopicOptions } from "@/types/flashcard.type";
import { BookCopy, ChevronDown, Filter, Search } from "lucide-react";
import { useDebounce } from "@/hooks";
import { Popover, PopoverContent, PopoverTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components";
import { TypeLanguageMeaning, typeLanguageOptions } from "@/types/speaking.type";
import { Pagination as PaginationType } from "@/types";
import { useConfirmDialogContext } from "@/components/ui/confirm-dialog-context";
import { Pagination } from "@/components/ui/pagination";
import { getNameAvatar } from "@/utils/funtions";
import dayjs from "dayjs";
import Image from "next/image";

export default function AdminFlashcardPage() {
    const router = useRouter();
    const { confirm } = useConfirmDialogContext();
    const [search, setSearch] = useState("");
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const searchDebounce = useDebounce(search, 300);

    const [params, setParams] = useState<FlashCardParams>({
        page: 1,
        limit: 12,
        search: searchDebounce,
        topic: undefined,
        type: undefined,
        is_admin: undefined,
    });

    const { data: decks, isLoading } = useGetAllFlashcardDecks(params);
    const { mutate: deleteMutation } = useDeleteFlashcardDeck();

    // Filter decks by search
    const filteredDecks = useMemo(() => {
        if (!decks?.data) return [];
        return decks.data.items;
    }, [decks]);

    const pagination: PaginationType = decks?.data?.pagination || {
        currentPage: params.page || 1,
        limit: params.limit || 10,
        totalItems: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    };

    useEffect(() => {
        setParams((prev) => ({
            ...prev,
            search: searchDebounce,
            page: 1, // Reset to first page on new search
        }));
    }, [searchDebounce]);

    const setFilter = (key: keyof FlashCardParams, value: any) => {
        setParams((prev) => ({
            ...prev,
            page: 1,
            [key]: value,
        }));
    };

    const handleDelete = (deck: FlashcardDeck) => {
        confirm({
            title: "Xóa bộ thẻ này?",
            description: `Bạn có chắc muốn xóa bộ thẻ "${deck.title}"? Tất cả thẻ trong bộ sẽ bị xóa vĩnh viễn.`,
            onConfirm: () => {
                deleteMutation(deck._id);
            }
        })
    };

    const clearFilters = () => {
        setSearch("");
        setParams({ page: 1, limit: 12, search: "", topic: undefined, type: undefined, is_admin: undefined });
    }

    const handlePageChange = (page: number) => {
        setParams((prev) => ({ ...prev, page }));
    };

    const hasActiveFilters = search || params.topic || params.type || params.is_admin;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b border-border sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                                <BookCopy className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                Quản lý Flashcard
                            </h1>
                            <p className="text-muted-foreground text-sm mt-1">
                                Tạo và quản lý các bộ thẻ từ vựng
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button
                                onClick={() => router.push(PATHS.ADMIN.FLASHCARD_CREATE)}
                                className="gap-1.5"
                            >
                                <FiPlus className="w-4 h-4" />
                                Tạo bộ thẻ mới
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Tìm kiếm bộ thẻ..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            leftIcon={<Search className="w-4 h-4" />}
                            className="h-9"
                        />
                    </div>
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className="gap-2 h-9"
                        >
                            <Filter className="w-4 h-4" />
                            Lọc
                            <ChevronDown
                                className={cn(
                                    "w-3 h-3 transition-transform",
                                    showFilterDropdown && "rotate-180"
                                )}
                            />
                        </Button>

                        <AnimatePresence>
                            {showFilterDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg p-3 z-20"
                                >
                                    <div className="mb-3">
                                        <label className="text-xs font-medium mb-1.5 block text-muted-foreground">
                                            Ngôn ngữ
                                        </label>
                                        <Select
                                            value={params.type ?? "all"}
                                            onValueChange={(value) =>
                                                setFilter("type", value === "all" ? undefined : value)
                                            }
                                        >
                                            <SelectTrigger className="h-9">
                                                <SelectValue placeholder="Tất cả" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả</SelectItem>
                                                {typeLanguageOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="text-xs font-medium mb-1.5 block text-muted-foreground">
                                            Chủ đề
                                        </label>
                                        <Select
                                            value={params.topic ?? "all"}
                                            onValueChange={(value) =>
                                                setFilter("topic", value === "all" ? undefined : value)
                                            }
                                        >
                                            <SelectTrigger className="h-9">
                                                <SelectValue placeholder="Tất cả" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả</SelectItem>
                                                {flashCardTopicOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="text-xs font-medium mb-1.5 block text-muted-foreground">
                                            Người tạo
                                        </label>
                                        <Select
                                            value={params.is_admin === undefined ? "all" : params.is_admin ? "true" : "false"}
                                            onValueChange={(value) =>
                                                setFilter("is_admin", value === "all" ? undefined : value === "true")
                                            }
                                        >
                                            <SelectTrigger className="h-9">
                                                <SelectValue placeholder="Tất cả" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả</SelectItem>
                                                <SelectItem value="true">Admin</SelectItem>
                                                <SelectItem value="false">Người dùng</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {hasActiveFilters && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearFilters}
                                            className="w-full h-8 text-xs"
                                        >
                                            Xóa bộ lọc
                                        </Button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Deck List */}
                {isLoading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="h-40 rounded-xl" />
                        ))}
                    </div>
                ) : filteredDecks.length === 0 ? (
                    <Card className="p-12 text-center">
                        <FiLayers className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                            {hasActiveFilters ? "Không tìm thấy bộ thẻ" : "Chưa có bộ thẻ nào"}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            {hasActiveFilters
                                ? "Thử tìm kiếm với từ khóa khác"
                                : "Bắt đầu tạo bộ thẻ flashcard đầu tiên"}
                        </p>
                        {!hasActiveFilters && (
                            <Button
                                onClick={() => router.push(PATHS.ADMIN.FLASHCARD_CREATE)}
                                className="gap-1.5"
                            >
                                <FiPlus className="w-4 h-4" />
                                Tạo bộ thẻ mới
                            </Button>
                        )}
                    </Card>
                ) : (
                    <motion.div
                        key={JSON.stringify(params)}
                        variants={ANIMATION_VARIANTS.staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {filteredDecks.map((deck: FlashcardDeck, index: number) => (
                            <motion.div
                                key={deck._id}
                                variants={ANIMATION_VARIANTS.fadeInUp}
                                custom={index}
                            >
                                <Card
                                    className="relative h-full rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                                    onClick={() => router.push(PATHS.ADMIN.FLASHCARD_EDIT(deck._id))}
                                >
                                    {/* ACTION ICONS */}
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(PATHS.ADMIN.FLASHCARD_EDIT(deck._id));
                                            }}
                                        >
                                            <FiEdit2 className="w-4 h-4 " />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-gray-400 hover:text-destructive"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(deck);
                                            }}
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-3 pr-10">
                                            {/* DECK ICON */}
                                            <div className="w-11 h-11 rounded-md bg-muted flex items-center justify-center overflow-hidden shrink-0">
                                                <Image
                                                    src={deck?.image || 'https://res.cloudinary.com/dnyodp0rd/image/upload/v1773669375/smile_wk5f59.png'}
                                                    alt={deck.title}
                                                    className="w-full h-full object-contain"
                                                    width={44}
                                                    height={44}
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                {/* TITLE */}
                                                <h3 className="font-semibold text-base truncate text-primary">
                                                    {deck.title}
                                                </h3>

                                                {/* DESCRIPTION */}
                                                {deck.description && (
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                        {deck.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center gap-2  mt-3 " >
                                            {/* META ROW */}
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                <Badge className="bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200 transition-colors">{FLASHCARD_TOPIC_MEANINGS[deck.topic]}</Badge>
                                                <Badge className="bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-200 transition-colors">{TypeLanguageMeaning[deck.type]}</Badge>
                                                <Badge className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 transition-colors">{deck.flashcards.length} thẻ</Badge>

                                                {/* AUTHOR */}
                                                {deck.author && (
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <div
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="flex items-center cursor-pointer"
                                                            >
                                                                {deck.author.avatar_url ?
                                                                    <Image
                                                                        src={deck.author.avatar_url || "/avatar.png"}
                                                                        alt={deck.author.full_name}
                                                                        className="w-6 h-6 rounded-full border object-cover"
                                                                        width={24}
                                                                        height={24}
                                                                    />
                                                                    :
                                                                    <div className="w-6 h-6 rounded-full border bg-pink-200  flex items-center justify-center text-xs text-pink-700">
                                                                        {getNameAvatar(deck.author.full_name)}
                                                                    </div>
                                                                }
                                                            </div>
                                                        </PopoverTrigger>

                                                        <PopoverContent
                                                            align="start"
                                                            className="w-auto p-3"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <div className="flex gap-3">
                                                                {deck?.author?.avatar_url ?
                                                                    <Image
                                                                        alt={deck.author.full_name}
                                                                        src={deck.author.avatar_url || "/avatar.png"}
                                                                        className="w-10 h-10 rounded-full object-cover"
                                                                        width={40}
                                                                        height={40}
                                                                    /> :
                                                                    <div className="w-10 h-10 rounded-full border bg-pink-200  flex items-center justify-center text-sm text-pink-700">
                                                                        {getNameAvatar(deck.author.full_name)}
                                                                    </div>
                                                                }


                                                                <div className="text-sm">
                                                                    <p className="font-medium">{deck.author.full_name}</p>
                                                                    <p className="text-muted-foreground text-xs">
                                                                        {deck.author.email}
                                                                    </p>
                                                                    {deck.author.phone && (
                                                                        <p className="text-xs mt-1">
                                                                            Điện thoại: {deck.author.phone}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                )}
                                            </div>

                                            {deck.updatedAt && (
                                                <div className="text-xs text-muted-foreground">
                                                    {dayjs(deck.updatedAt).format("DD/MM/YYYY")}
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {filteredDecks.length > 0 && (
                    <Card className="mt-4 border-none">
                        <CardContent className="py-3 px-4">
                            <Pagination
                                pagination={pagination}
                                onPageChange={handlePageChange}
                                variant="compact"
                                size="sm"
                            />
                        </CardContent>
                    </Card>
                )}
            </div>

        </div>
    );
}
