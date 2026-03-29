"use client";

import { IMAGE_DEFAULT, WritingExam } from "@/types/writing.type";
import { LevelExam, UserRole } from "@/utils/constants/enum";
import { motion } from 'framer-motion';
import { Badge, Button, Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui";
import { cn } from "@/utils";
import Image from "next/image";
import { CheckCircle, Edit, Eye, History, PenLine, Trash2, XCircle } from "lucide-react";
import { levelExamMeaning, TypeLanguageMeaning } from "@/types/speaking.type";
import dayjs from "dayjs";
import Link from "next/link";
import { PATHS } from "@/utils/constants";
import { useAuth } from "@/contexts";

interface WritingExamCardProps {
    role: UserRole;
    exam: WritingExam;
    onEdit?: (exam: WritingExam) => void;
    onDelete?: (exam: WritingExam) => void;
    onPreview?: (exam: WritingExam) => void;
}

const WritingExamCard = ({ role, exam, onEdit, onDelete, onPreview }: WritingExamCardProps) => {
    const { isAuthenticated, openAuthModal } = useAuth();
    const imageUrl = IMAGE_DEFAULT[exam.title.length % IMAGE_DEFAULT.length];
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <Card className={cn(
                "h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300",
                !exam.is_published && "opacity-70 border-dashed"
            )} hoverable>
                {/* Header */}
                <div className="relative w-full h-32 bg-gradient-to-br from-primary/15 via-primary/5 to-primary/10 flex items-center justify-center">
                    <Image
                        src={imageUrl}
                        alt="Exam Image"
                        className="object-cover"
                        height={128}
                        width={128}
                    />
                    {role === UserRole.ADMIN &&
                        <>
                            <div className="absolute top-2 left-2 flex gap-1">
                                {exam.is_published ? (
                                    <Badge variant="success" className="gap-1 text-xs">
                                        <CheckCircle className="w-3 h-3" />
                                        Đã xuất bản
                                    </Badge>
                                ) : (
                                    <Badge variant="warning" className="gap-1 text-xs">
                                        <XCircle className="w-3 h-3" />
                                        Bản nháp
                                    </Badge>
                                )}
                            </div>
                            <div className="absolute top-1 right-2">
                                <Badge variant="info" className="text-xs">
                                    {TypeLanguageMeaning[exam.type]}
                                </Badge>
                            </div>
                        </>
                    }

                    <div className="absolute -bottom-0 left-2">
                        <Badge variant="info"
                            className={`${exam.level === LevelExam.EASY ? 'bg-green-200 text-green-800' : exam.level === LevelExam.MEDIUM ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'} text-[9px]`}
                        >
                            {levelExamMeaning[exam.level]}
                        </Badge>
                    </div>
                </div>

                <CardHeader className="p-3 sm:p-4 pb-1 flex-1">
                    <CardTitle className="text-base sm:text-lg line-clamp-1 min-h-[0.5rem]">
                        {exam.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-1 text-xs sm:text-sm min-h-[2.5rem]">
                        {exam.content.substring(0, 100)}...
                    </CardDescription>
                    <div className='mt-2 flex justify-between items-center'>
                        <p className="text-xs text-muted-foreground">
                            {dayjs(exam.updatedAt).format('DD/MM/YYYY ')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {exam.vocabularies ? `${exam.vocabularies.length} từ vựng` : ''}
                        </p>
                    </div>

                </CardHeader>

                {role === UserRole.ADMIN ?
                    <CardFooter className="p-3 sm:p-4 !pt-0 gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-1 h-8 sm:h-9 text-xs sm:text-sm"
                            onClick={() => onPreview?.(exam)}
                        >
                            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            Xem
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-1 h-8 sm:h-9 text-xs sm:text-sm"
                            onClick={() => onEdit?.(exam)}
                        >
                            <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            Sửa
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:bg-destructive/10 h-8 w-8 sm:h-9 sm:w-9"
                            onClick={() => onDelete?.(exam)}
                        >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                    </CardFooter>
                    :
                    <CardFooter className="p-3 sm:p-4 !pt-0 gap-2">
                        {isAuthenticated ? (
                            <>
                                <Link href={PATHS.CLIENT.WRITING_DETAIL(exam._id)} className="flex-1">
                                    <Button variant="default" className="w-full gap-2 h-8 text-sm bg-primary hover:bg-primary/80">
                                        <PenLine className="w-4 h-4" />
                                        Luyện viết
                                    </Button>
                                </Link>
                                <Link href={PATHS.CLIENT.WRITING_HISTORY(exam._id)}>
                                    <Button variant="outline" size="icon" className="h-8 w-8">
                                        <History className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <Button variant="default" className="w-full gap-2 h-8 text-sm bg-primary hover:bg-primary/80" onClick={openAuthModal}>
                                <PenLine className="w-4 h-4" />
                                Luyện viết
                            </Button>
                        )}
                    </CardFooter>

                }
            </Card>
        </motion.div>
    );
}

export default WritingExamCard;