import { POS_OPTIONS_EN, POS_OPTIONS_ZH, Vocabulary } from "@/types/speaking.type";
import { TypeLanguage } from "@/utils/constants/enum";
import { useState } from "react";
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui";
import { Pencil, Trash2 } from "lucide-react";
import { useConfirmDialogContext } from "../ui/confirm-dialog-context";


interface VocabularyAdminProps {
    examType: TypeLanguage;
    vocabularies: Vocabulary[];
    addVocabulary: (word: Vocabulary) => void;
    updateVocabulary: (index: number, word: Vocabulary) => void;
    deleteVocabulary: (index: number) => void;
}

const VocabularyAdmin = ({ examType, vocabularies, addVocabulary, updateVocabulary, deleteVocabulary }: VocabularyAdminProps) => {
    const { confirm } = useConfirmDialogContext();
    const [newWord, setNewWord] = useState<Vocabulary>({ vocabulary: "", meaning: "", type: "" });

    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editItem, setEditItem] = useState<Vocabulary>({ vocabulary: "", meaning: "", type: "" });

    const POS_OPTIONS = examType === TypeLanguage.ENGLISH ? POS_OPTIONS_EN : POS_OPTIONS_ZH;
    const handleAddWord = () => {
        addVocabulary({
            vocabulary: newWord.vocabulary,
            meaning: newWord.meaning,
            type: POS_OPTIONS.find(option => option.value === newWord.type)?.label || newWord.type || "", // Lấy label hiển thị hoặc giữ nguyên nếu không tìm thấy
        });
        setNewWord({ vocabulary: "", meaning: "", type: "" });
    };

    const deleteWord = (index: number) => {
        confirm({
            title: "Xác nhận xoá",
            description: "Bạn có chắc chắn muốn xoá từ vựng này không?",
            onConfirm: () => {
                deleteVocabulary(index);
            }
        })
    };

    const startEdit = (index: number) => {
        setEditIndex(index);
        setEditItem(vocabularies[index]);
    };

    const handleSave = (index: number) => {
        updateVocabulary(index, editItem);
        setEditItem({ vocabulary: "", meaning: "", type: "" });
        setEditIndex(null);
    };

    const cancelEdit = () => {
        setEditIndex(null);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Danh sách từ vựng</h3>
                <Button
                    size="sm"
                    className="px-3"
                    onClick={handleAddWord}
                    disabled={!newWord.vocabulary || !newWord.meaning}
                >
                    Thêm
                </Button>
            </div>

            {/* Form nhập từ */}
            <div className="flex flex-col sm:flex-row gap-2">
                <Input
                    className="text-sm"
                    placeholder="Từ vựng"
                    value={newWord.vocabulary}
                    onChange={(e) => setNewWord({ ...newWord, vocabulary: e.target.value })}
                />
                <Input
                    className="text-sm"
                    placeholder="Nghĩa"
                    value={newWord.meaning}
                    onChange={(e) => setNewWord({ ...newWord, meaning: e.target.value })}
                />
                <Select
                    value={newWord.type}
                    onValueChange={(value) => setNewWord({ ...newWord, type: value })}
                >
                    <SelectTrigger className="text-sm w-20">
                        <SelectValue placeholder="Loại từ" />
                    </SelectTrigger>
                    <SelectContent className="text-sm w-20">
                        {POS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>


            </div>

            {/* Danh sách từ vựng */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {vocabularies.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center mt-10">Chưa có từ nào</p>
                )}

                {vocabularies.map((item, index) => (
                    <div
                        key={index}
                        className="group flex items-start justify-between bg-muted/30 p-2 rounded-md"
                    >
                        {/* Text */}
                        {editIndex === index ? (
                            <div className="flex flex-row flex-1 min-w-0 gap-1 pr-8"> {/* chừa không gian cho nút */}
                                <div className="flex-1">
                                    <Input
                                        className="text-xs h-6 rounded-sm"
                                        value={editItem.vocabulary}
                                        onChange={(e) =>
                                            setEditItem({ ...editItem, vocabulary: e.target.value })
                                        }
                                    />
                                </div>
                                <div className=" w-1/2 ">
                                    <Input
                                        className="text-xs h-6 rounded-sm"
                                        value={editItem.meaning}
                                        onChange={(e) =>
                                            setEditItem({ ...editItem, meaning: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="w-11">
                                    <Input
                                        className="text-xs h-6 rounded-sm"
                                        value={editItem.type}
                                        onChange={(e) =>
                                            setEditItem({ ...editItem, type: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-wrap flex-row flex-1 min-w-0"> {/* chừa chỗ */}
                                <span className="flex-1 font-medium text-sm break-words">
                                    {item.vocabulary}
                                </span>
                                <span className="text-xs text-muted-foreground break-words w-1/2">
                                    {item.meaning}
                                </span>
                                <span className="text-xs text-muted-foreground break-words w-11">
                                    {item.type}
                                </span>
                            </div>
                        )}

                        {/* Nút (KHÔNG đẩy layout, nhờ fixed width + absolute) */}
                        <div className="relative w-8 flex justify-end">
                            <div className="
        absolute right-0 top-[10px] -translate-y-1/2 
        flex gap-1 
        opacity-0 group-hover:opacity-100 
        pointer-events-none group-hover:pointer-events-auto
        transition-opacity
      ">
                                {editIndex === index ? (
                                    <>
                                        <Button
                                            type="button"
                                            size="sm"
                                            className="text-[10px] h-6 px-2"
                                            onClick={() => handleSave(index)}
                                        >
                                            Lưu
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            className="text-[10px] h-6 px-0"
                                            onClick={cancelEdit}
                                        >
                                            Huỷ
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="h-4 w-4 text-blue-600"
                                            onClick={() => startEdit(index)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>

                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="h-4 w-4 text-red-600"
                                            onClick={() => deleteWord(index)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default VocabularyAdmin;