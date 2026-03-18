"use client";
import Link from "next/link";
import { FiSearch, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Card, CardContent, Button, Badge, Input, Progress, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui";
import { PATHS } from "@/utils/constants";
import { useDebounce, useDeleteFlashcardDeck, useGetAllFlashcardDecksForClient } from "@/hooks";
import { FLASHCARD_TOPIC_MEANINGS, FlashcardDeck, FlashCardParams, flashCardTopicOptions } from "@/types/flashcard.type";
import { TypeLanguageMeaning, typeLanguageOptions } from "@/types/speaking.type";
import Image from "next/image";
import { useAuth } from "@/contexts";
import { useConfirmDialogContext } from "../ui/confirm-dialog-context";
import LoadingCustom from "../ui/loading-custom";
import { ChevronDown, Clock1, Filter } from "lucide-react";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { DismissableLayer } from "@radix-ui/react-dismissable-layer";
import { useEffect, useState } from "react";
import { cn } from "@/utils";

export function FlashcardClient() {

    const { mutate: deleteFlashcardDeck } = useDeleteFlashcardDeck();
    const { confirm } = useConfirmDialogContext();

    const { user } = useAuth()


    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [search, setSearch] = useState("");

    const searchDebounce = useDebounce(search, 500);
    const [params, setParams] = useState<FlashCardParams>({
        page: 1,
        limit: 1000,
        search: searchDebounce,
        topic: undefined,
        type: undefined
    });

    const { data: flashcardDeckRes, isLoading } = useGetAllFlashcardDecksForClient(params); // Lấy danh sách flashcard deck từ API
    const flashcardDecks: FlashcardDeck[] = flashcardDeckRes?.data?.items || [];

    useEffect(() => {
        setParams((prev) => ({
            ...prev,
            search: searchDebounce,
            page: 1, // Reset to first page on new search
        }));
    }, [searchDebounce]);

    const handleDeleteDeck = async (deck: FlashcardDeck) => {
        confirm({
            title: "Xác nhận xóa",
            description: `Bạn có chắc muốn xóa bộ flashcard "${deck.title}" không? Toàn bộ thẻ trong bộ này sẽ bị xóa và không thể khôi phục.`,
            onConfirm: () => {
                deleteFlashcardDeck(deck._id);
            }
        })
    }

    const setFilter = (key: keyof FlashCardParams, value: any) => {
        setParams((prev) => ({
            ...prev,
            page: 1,
            [key]: value,
        }));
    };
    return (
        <div>
            {/* Search and Create */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex-1">
                    <Input
                        className="h-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm kiếm bộ flashcard..."
                        leftIcon={<FiSearch className="w-5 h-5" />}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-28 h-8">
                        <Button
                            variant="outline"
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className="gap-2 h-8 w-full sm:w-auto"
                        >
                            <Filter className="w-4 h-4" />
                            Lọc
                            <ChevronDown
                                className={cn(
                                    'w-4 h-4 transition-transform',
                                    showFilterDropdown && 'rotate-180'
                                )}
                            />
                        </Button>

                        {/* Dropdown */}
                        <AnimatePresence>
                            {showFilterDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 w-[calc(100vw-2rem)] sm:w-64 max-w-xs mt-2 bg-card border border-border rounded-xl shadow-lg p-4 z-20"
                                >

                                    <DismissableLayer
                                        onInteractOutside={(e) => {
                                            // Nếu click vào select-content thì không đóng
                                            if ((e.target as HTMLElement).closest("[data-radix-select-content]")) {
                                                e.preventDefault();
                                                return;
                                            }

                                            // Còn lại → đóng dropdown
                                            setShowFilterDropdown(false);
                                        }}
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
                                    </DismissableLayer>



                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link href={PATHS.CLIENT.FLASHCARD_CREATE}>
                        <Button className="h-8">
                            <FiPlus className="w-4 h-4 mr-2" />
                            Tạo bộ flashcard
                        </Button>
                    </Link>
                </div>

            </div>

            {/* Flashcard Decks Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {
                    isLoading ? <LoadingCustom className="min-h-[450px] col-span-2 lg:col-span-3 xl:col-span-4" /> :
                        flashcardDecks.map((deck) => (
                            <Link
                                key={deck._id}
                                href={`/flashcard/${deck._id}`}
                                className="group block"
                            >
                                <Card variant="default" hoverable className="h-full">
                                    {/* Header */}
                                    <div className="relative h-32 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 rounded-t-xl p-4">
                                        {/* Category badge */}
                                        <Badge variant="secondary" size="sm" className="absolute top-3 left-3 bg-sky-200 text-sky-800 hover:bg-sky-300 ">
                                            {FLASHCARD_TOPIC_MEANINGS[deck.topic]}
                                        </Badge>
                                        <Badge variant="secondary" size="sm" className="absolute top-9 left-3 bg-purple-200 text-purple-800 hover:bg-purple-300 ">
                                            {TypeLanguageMeaning[deck.type]}
                                        </Badge>
                                        {/* New badge */}
                                        {deck.created_by !== user?._id && (
                                            <Badge variant="secondary" size="sm" className="absolute top-3 right-3">
                                                {deck.is_admin ? "Admin" : deck?.author?.full_name.split(' ')?.[deck?.author?.full_name.split(' ').length - 1] || "User"}
                                            </Badge>
                                        )}
                                        {/* Action buttons (edit / delete) nếu user tạo */}
                                        {deck.created_by === user?._id && (
                                            <div className="absolute bottom-1 right-2 flex gap-1">

                                                {/* Edit */}
                                                <Link href={PATHS.CLIENT.FLASHCARD_EDIT(deck._id)}>
                                                    <button
                                                        // onClick={(e) => { e.preventDefault(); }}
                                                        className="p-1 rounded-md bg-transparent hover:bg-blue-50"
                                                    >
                                                        <FiEdit2 className="w-3 h-3 text-blue-600" />
                                                    </button>
                                                </Link>


                                                {/* Delete */}
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleDeleteDeck(deck);
                                                    }}
                                                    className="p-1 rounded-md bg-transparent hover:bg-red-50"
                                                >
                                                    <FiTrash2 className="w-3 h-3 text-red-600" />
                                                </button>

                                            </div>
                                        )}

                                        {/* image căn hình tròn ở giữa */}
                                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-24 overflow-hidden opacity-50">
                                            <Image
                                                src={deck?.image || 'https://res.cloudinary.com/dnyodp0rd/image/upload/v1773669365/studying_rmfc63.png'}
                                                alt={deck.title}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>

                                    <CardContent className="p-4">
                                        {/* Title */}
                                        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                            {deck.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-xs text-muted-foreground mb-1 line-clamp-1 min-h-[1rem]">
                                            {deck.description}
                                        </p>

                                        {/* Progress */}
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="text-primary">Tiến độ</span>
                                                <span className="font-medium">{deck?.userFlashcard?.correct_cards || 0}/{deck.flashcards.length}</span>
                                            </div>
                                            <Progress value={deck.flashcards.length > 0 ? Math.round(((deck?.userFlashcard?.correct_cards || 0) / deck.flashcards.length) * 100) : 0} size="sm" />
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground flex items-center">
                                                <Clock1 className="w-3.5 h-3.5 mr-1" />
                                                {deck?.userFlashcard?.last_studied_at ? dayjs(deck?.userFlashcard?.last_studied_at).format("DD/MM/YYYY HH:mm") : "Chưa học"} {/* Hiển thị thời gian học gần nhất */}
                                            </span>
                                            <Button size="sm" variant="secondary" className="group-hover:bg-primary group-hover:text-white">
                                                Học ngay
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
            </div>
        </div>
    )
}