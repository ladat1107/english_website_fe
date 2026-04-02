"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import { TextAlign } from "@tiptap/extension-text-align"
import { Underline } from "@tiptap/extension-underline"
import { Link } from "@tiptap/extension-link"
import { Placeholder } from "@tiptap/extension-placeholder"
import { Image } from "@tiptap/extension-image"
import TableRow from "@tiptap/extension-table-row"
import TableHeader from "@tiptap/extension-table-header"
import TableCell from "@tiptap/extension-table-cell"
import { BorderShading } from "@/extensions/border-shading";
import { useEffect, useCallback, useMemo, useState, useRef } from "react"
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Undo,
    Redo,
    Underline as UnderlineIcon,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Palette,
    Link as LinkIcon,
    Quote,
    ImageIcon,
    Minus,
    Eye,
    EyeOff,
    Loader2,
    Maximize2,
    Minimize2,
    Table2,
    TableRowsSplit,
    Columns3,
    Trash2,
    Plus,
    ChevronDown,
    Square,
} from "lucide-react"
import "./text-editor.css"
import { cn } from "@/utils"
import { useCloudinaryUpload } from "@/hooks"
import { useToast } from "../ui/toaster"
import { CloudinaryFolder } from "@/lib/cloudinary"
import { Table } from "@tiptap/extension-table"

interface TextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    disabled?: boolean
    error?: string
    className?: string
}

export default function TextEditor({
    value,
    onChange,
    placeholder = "Nhập nội dung bài viết...",
    disabled = false,
    error,
    className
}: TextEditorProps) {

    // Tạo state chỉ để trigger re-render
    const [, setForceUpdate] = useState(0);
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showTableMenu, setShowTableMenu] = useState(false)
    const colorPickerRef = useRef<HTMLDivElement>(null)
    const tableMenuRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const editorContainerRef = useRef<HTMLDivElement>(null)

    const { addToast } = useToast()

    // Close color picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
                setShowColorPicker(false)
            }
            if (tableMenuRef.current && !tableMenuRef.current.contains(event.target as Node)) {
                setShowTableMenu(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // Handle ESC key to exit fullscreen
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false)
            }
        }

        if (isFullscreen) {
            document.addEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [isFullscreen])

    const toggleFullscreen = useCallback(() => {
        setIsFullscreen(prev => !prev)
    }, [])

    const handleUpdate = useCallback(
        ({ editor }: { editor: any }) => {
            const html = editor.getHTML()
            if (html !== value) {
                onChange(html)
            }
        },
        [onChange, value]
    )

    const extensions = useMemo(() => [
        StarterKit.configure({
            heading: {
                levels: [1, 2, 3, 4, 5, 6],
            },
        }),
        TextStyle,
        Color.configure({
            types: ['textStyle']
        }),
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        Underline,
        Link.configure({
            openOnClick: false,
            HTMLAttributes: {
                rel: 'noopener noreferrer',
                target: '_blank',
            },
        }),
        Placeholder.configure({
            placeholder,
            showOnlyWhenEditable: true,
            showOnlyCurrent: true,
        }),
        Image.configure({
            HTMLAttributes: {
                class: 'news-editor-image',
            },
        }),
        Table.configure({
            resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        BorderShading,
    ], [placeholder])

    const editor = useEditor({
        extensions,
        content: value || "",
        onUpdate: handleUpdate,
        onSelectionUpdate() {
            // Mỗi lần selection thay đổi, ép React re-render
            setForceUpdate(x => x + 1);
        },
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'news-editor-content focus:outline-none min-h-[300px]',
            },
        },
    })

    const {
        isUploading,
        progress,
        uploadImage,
    } = useCloudinaryUpload({
        folder: CloudinaryFolder.BLOG_IMAGES,
        onSuccess: (result) => {
            const alt = result.originalFilename.split('.')[0] || 'Blog image ' + Date.now()
            editor?.chain().focus().setImage({ src: result.url, alt }).run()
        },
        onError: (error) => {
            console.error('Upload error:', error)
            addToast("Có lỗi khi upload ảnh. Vui lòng thử lại!", "error")
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || "", { emitUpdate: false })
        }
    }, [value, editor])

    const setLink = useCallback(() => {
        const previousUrl = editor?.getAttributes('link').href
        const url = window.prompt('Nhập URL:', previousUrl)

        if (url === null) return

        if (url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor])

    const handleImageUpload = useCallback(async (file: File) => {
        if (!editor || !file) return
        await uploadImage(file);
    }, [editor])

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleImageUpload(file)
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }, [handleImageUpload])

    const triggerFileInput = useCallback(() => {
        fileInputRef.current?.click()
    }, [])

    const getCurrentHeading = () => {
        if (!editor) return 'p'
        for (let i = 1; i <= 6; i++) {
            if (editor.isActive('heading', { level: i })) {
                return `h${i}`
            }
        }
        return 'p'
    }

    const setHeading = (value: string) => {
        if (!editor) return
        if (value === 'p') {
            editor.chain().focus().setParagraph().run()
        } else {
            const level = parseInt(value.replace('h', '')) as 1 | 2 | 3 | 4 | 5 | 6
            editor.chain().focus().toggleHeading({ level }).run()
        }
    }

    if (!editor) {
        return (
            <div className="border border-border rounded-lg p-4 min-h-[300px] animate-pulse bg-muted/30"></div>
        )
    }

    // Colors for picker (light theme friendly)
    const colors = [
        "#D42525", "#FDECEC", "#B71C1C", "#FF7373", "#FF9A9A",
        "#FFC400", "#FFDD57", "#FFE9A5", "#FFB74D", "#FF8A65",
        "#1976D2", "#42A5F5", "#90CAF9", "#26C6DA", "#80DEEA",
        "#2E7D32", "#66BB6A", "#A5D6A7", "#FB8C00", "#039BE5",
        "#FFFFFF", "#F9F9F9", "#F2F2F2", "#E5E5E5", "#D9D9D9",
        "#C4C4C4", "#9E9E9E", "#757575", "#4F4F4F", "#212121"
    ];

    const headingOptions = [
        { value: 'p', label: 'Đoạn văn' },
        { value: 'h1', label: 'Heading 1' },
        { value: 'h2', label: 'Heading 2' },
        { value: 'h3', label: 'Heading 3' },
        { value: 'h4', label: 'Heading 4' },
        { value: 'h5', label: 'Heading 5' },
        { value: 'h6', label: 'Heading 6' },
    ]

    // Shared button classes
    const btnBase = "p-1.5 rounded transition-colors duration-150 cursor-pointer"
    const btnDefault = "text-muted-foreground hover:bg-muted hover:text-foreground"
    const btnActive = "bg-primary text-primary-foreground"

    return (
        <div
            ref={editorContainerRef}
            className={cn(
                "w-full",
                isFullscreen && "fixed inset-0 z-50 bg-background flex flex-col"
            )}
        >
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Toolbar */}
            <div className={cn(
                "flex flex-wrap gap-0.5 border border-border bg-muted/40 py-1.5 px-2 items-center",
                isFullscreen ? "rounded-none" : "rounded-t-lg"
            )}>
                {/* Heading Selector */}
                <div className="flex items-center gap-1 border-r border-border pr-2 mr-0.5">
                    <select
                        value={getCurrentHeading()}
                        onChange={(e) => setHeading(e.target.value)}
                        className="h-7 px-1.5 text-xs bg-background border border-border rounded text-foreground
                       hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary/50
                       cursor-pointer transition-colors"
                    >
                        {headingOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Text Styling */}
                <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-0.5">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={cn(btnBase, editor.isActive('bold') ? btnActive : btnDefault)}
                        title="Bold (Ctrl+B)"
                    >
                        <Bold size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={cn(btnBase, editor.isActive('italic') ? btnActive : btnDefault)}
                        title="Italic (Ctrl+I)"
                    >
                        <Italic size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={cn(btnBase, editor.isActive('underline') ? btnActive : btnDefault)}
                        title="Underline (Ctrl+U)"
                    >
                        <UnderlineIcon size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={cn(btnBase, editor.isActive('strike') ? btnActive : btnDefault)}
                        title="Strikethrough"
                    >
                        <Strikethrough size={14} />
                    </button>

                    {/* Color Picker */}
                    <div className="relative" ref={colorPickerRef}>
                        <button
                            type="button"
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            className={cn(btnBase, btnDefault)}
                            title="Text Color"
                        >
                            <Palette size={14} />
                        </button>
                        {showColorPicker && (
                            <div className="absolute top-9 left-0 z-50 bg-background border border-border rounded-lg shadow-soft p-2.5 min-w-[148px]">
                                <div className="grid grid-cols-6 gap-1">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            className="w-4 h-4 rounded border border-border hover:scale-110 transition"
                                            style={{ backgroundColor: color }}
                                            onClick={() => {
                                                editor.chain().focus().setColor(color).run()
                                                setShowColorPicker(false)
                                            }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                                <div className="mt-2 flex items-center gap-1">
                                    <input
                                        type="text"
                                        placeholder="#000000"
                                        className="w-full px-2 py-1 text-xs bg-muted border rounded"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                const value = (e.target as HTMLInputElement).value.trim()
                                                if (/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(value)) {
                                                    editor.chain().focus().setColor(value).run()
                                                    setShowColorPicker(false)
                                                }
                                            }
                                        }}
                                    />
                                    <button
                                        className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded"
                                        onClick={() => {
                                            const input = colorPickerRef.current?.querySelector("input") as HTMLInputElement
                                            const value = input?.value.trim() || ""
                                            if (/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(value)) {
                                                editor.chain().focus().setColor(value).run()
                                                setShowColorPicker(false)
                                            }
                                        }}
                                    >
                                        OK
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    className="mt-2 px-2 py-1 text-xs bg-muted hover:bg-muted/80 text-muted-foreground rounded w-full transition-colors duration-150"
                                    onClick={() => {
                                        editor.chain().focus().unsetColor().run()
                                        setShowColorPicker(false)
                                    }}
                                >
                                    Xóa màu
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Alignment */}
                <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-0.5">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className={cn(btnBase, editor.isActive({ textAlign: 'left' }) ? btnActive : btnDefault)}
                        title="Align Left"
                    >
                        <AlignLeft size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className={cn(btnBase, editor.isActive({ textAlign: 'center' }) ? btnActive : btnDefault)}
                        title="Align Center"
                    >
                        <AlignCenter size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        className={cn(btnBase, editor.isActive({ textAlign: 'right' }) ? btnActive : btnDefault)}
                        title="Align Right"
                    >
                        <AlignRight size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        className={cn(btnBase, editor.isActive({ textAlign: 'justify' }) ? btnActive : btnDefault)}
                        title="Justify"
                    >
                        <AlignJustify size={14} />
                    </button>
                </div>

                {/* Lists & Blocks */}
                <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-0.5">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={cn(btnBase, editor.isActive('bulletList') ? btnActive : btnDefault)}
                        title="Bullet List"
                    >
                        <List size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={cn(btnBase, editor.isActive('orderedList') ? btnActive : btnDefault)}
                        title="Numbered List"
                    >
                        <ListOrdered size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={cn(btnBase, editor.isActive('blockquote') ? btnActive : btnDefault)}
                        title="Blockquote"
                    >
                        <Quote size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        className={cn(btnBase, btnDefault)}
                        title="Horizontal Rule"
                    >
                        <Minus size={14} />
                    </button>
                </div>

                {/* Table */}
                <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-0.5" ref={tableMenuRef}>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowTableMenu(!showTableMenu)}
                            className={cn(
                                btnBase,
                                "flex items-center gap-0.5",
                                editor.isActive('table') ? btnActive : btnDefault
                            )}
                            title="Table"
                        >
                            <Table2 size={14} />
                            <ChevronDown size={10} />
                        </button>

                        {showTableMenu && (
                            <div className="absolute top-9 left-0 z-50 bg-background border border-border rounded-lg shadow-soft p-1 min-w-[180px]">
                                {/* Insert table */}
                                {!editor.isActive('table') && (
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 w-full px-2.5 py-1.5 text-xs text-foreground hover:bg-muted rounded transition-colors"
                                        onClick={() => {
                                            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
                                            setShowTableMenu(false)
                                        }}
                                    >
                                        <Plus size={12} className="text-primary" />
                                        Thêm bảng 3×3
                                    </button>
                                )}

                                {editor.isActive('table') && (
                                    <>
                                        <div className="px-2 py-1 text-xxs font-medium text-muted-foreground uppercase tracking-wide">Hàng</div>
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 w-full px-2.5 py-1.5 text-xs text-foreground hover:bg-muted rounded transition-colors"
                                            onClick={() => { editor.chain().focus().addRowBefore().run(); setShowTableMenu(false) }}
                                        >
                                            <TableRowsSplit size={12} className="text-primary" />
                                            Thêm hàng phía trên
                                        </button>
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 w-full px-2.5 py-1.5 text-xs text-foreground hover:bg-muted rounded transition-colors"
                                            onClick={() => { editor.chain().focus().addRowAfter().run(); setShowTableMenu(false) }}
                                        >
                                            <TableRowsSplit size={12} className="text-primary" />
                                            Thêm hàng phía dưới
                                        </button>
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 w-full px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10 rounded transition-colors"
                                            onClick={() => { editor.chain().focus().deleteRow().run(); setShowTableMenu(false) }}
                                        >
                                            <Trash2 size={12} />
                                            Xóa hàng
                                        </button>

                                        <div className="h-px bg-border my-1" />

                                        <div className="px-2 py-1 text-xxs font-medium text-muted-foreground uppercase tracking-wide">Cột</div>
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 w-full px-2.5 py-1.5 text-xs text-foreground hover:bg-muted rounded transition-colors"
                                            onClick={() => { editor.chain().focus().addColumnBefore().run(); setShowTableMenu(false) }}
                                        >
                                            <Columns3 size={12} className="text-primary" />
                                            Thêm cột bên trái
                                        </button>
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 w-full px-2.5 py-1.5 text-xs text-foreground hover:bg-muted rounded transition-colors"
                                            onClick={() => { editor.chain().focus().addColumnAfter().run(); setShowTableMenu(false) }}
                                        >
                                            <Columns3 size={12} className="text-primary" />
                                            Thêm cột bên phải
                                        </button>
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 w-full px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10 rounded transition-colors"
                                            onClick={() => { editor.chain().focus().deleteColumn().run(); setShowTableMenu(false) }}
                                        >
                                            <Trash2 size={12} />
                                            Xóa cột
                                        </button>

                                        <div className="h-px bg-border my-1" />

                                        <button
                                            type="button"
                                            className="flex items-center gap-2 w-full px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10 rounded transition-colors"
                                            onClick={() => { editor.chain().focus().deleteTable().run(); setShowTableMenu(false) }}
                                        >
                                            <Trash2 size={12} />
                                            Xóa bảng
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>


                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setBorderShading().run()}
                        className={cn(btnBase, btnDefault)}
                        title="Border Shading box"
                    >
                        <Square size={14} />
                    </button>
                </div>

                {/* Media & Links */}
                <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-0.5">
                    <button
                        type="button"
                        onClick={setLink}
                        className={cn(btnBase, editor.isActive('link') ? btnActive : btnDefault)}
                        title="Add Link"
                    >
                        <LinkIcon size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={triggerFileInput}
                        disabled={isUploading}
                        className={cn(
                            btnBase,
                            isUploading ? 'text-primary bg-primary/10' : btnDefault,
                            "disabled:opacity-60"
                        )}
                        title="Upload Image"
                    >
                        {isUploading ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <ImageIcon size={14} />
                        )}
                    </button>
                </div>

                {/* Undo/Redo & Preview */}
                <div className="flex items-center gap-0.5">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().undo().run()}
                        className={cn(btnBase, btnDefault, "disabled:opacity-40 disabled:cursor-not-allowed")}
                        disabled={!editor.can().chain().focus().undo().run()}
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().redo().run()}
                        className={cn(btnBase, btnDefault, "disabled:opacity-40 disabled:cursor-not-allowed")}
                        disabled={!editor.can().chain().focus().redo().run()}
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo size={14} />
                    </button>

                    <div className="w-px h-5 bg-border mx-1"></div>

                    <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className={cn(
                            btnBase,
                            "flex items-center gap-1 text-xs",
                            showPreview ? btnActive : btnDefault
                        )}
                        title="Preview"
                    >
                        {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                        <span className="hidden sm:inline text-xs">{showPreview ? 'Ẩn' : 'Xem'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        className={cn(
                            btnBase,
                            "flex items-center gap-1 text-xs",
                            isFullscreen ? btnActive : btnDefault
                        )}
                        title={isFullscreen ? "Thu nhỏ (ESC)" : "Toàn màn hình"}
                    >
                        {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                        <span className="hidden sm:inline text-xs">{isFullscreen ? 'Thu nhỏ' : 'Mở rộng'}</span>
                    </button>
                </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
                <div className={cn(
                    "bg-muted/50 px-3 py-1.5 border-x border-border",
                    isFullscreen && "border-x-0"
                )}>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 size={11} className="animate-spin" />
                        <span>Đang tải ảnh lên...</span>
                        <span className="text-primary font-medium">{Math.round(progress)}%</span>
                    </div>
                    <div className="mt-1 h-1 bg-border rounded overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-300 rounded"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Editor / Preview */}
            {showPreview ? (
                <div
                    className={cn(
                        "border border-t-0 border-border bg-background overflow-y-auto blog-content",
                        isFullscreen ? "flex-1 rounded-none border-x-0 p-6" : "rounded-b-lg min-h-[300px] p-4",
                        className
                    )}
                    dangerouslySetInnerHTML={{ __html: value }}
                />
            ) : (
                <div className={cn(
                    "relative border border-t-0 border-border bg-background",
                    isFullscreen ? "flex-1 rounded-none border-x-0 overflow-y-auto" : "rounded-b-lg min-h-[400px]",
                    error ? 'border-destructive' : 'focus-within:border-primary/50 focus-within:shadow-[0_0_0_2px_hsl(var(--primary)/0.08)]',
                    "transition-all duration-200 overflow-y-auto",
                    className
                )}>
                    <EditorContent
                        editor={editor}
                        disabled={disabled}
                        className="w-full h-full"
                    />
                </div>
            )}

            {/* Error message */}
            {error && !isFullscreen && (
                <p className="text-destructive text-xs mt-1.5">{error}</p>
            )}
        </div>
    )
}
