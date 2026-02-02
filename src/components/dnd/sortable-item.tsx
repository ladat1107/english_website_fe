/**
 * SortableItem - Wrapper cho item có thể kéo thả
 * 
 * @description
 * Đây là wrapper DÙNG CHUNG, bọc bất kỳ nội dung nào để biến nó thành
 * item có thể kéo thả. Component này cung cấp:
 * - Drag handle (nút kéo)
 * - Transform animation khi kéo
 * - Các trạng thái: isDragging, isOver
 * 
 * @example
 * <SortableItem id={item.id}>
 *   {({ dragHandleProps, isDragging }) => (
 *     <div>
 *       <button {...dragHandleProps}>⋮⋮</button>
 *       <span>Nội dung item</span>
 *     </div>
 *   )}
 * </SortableItem>
 */

import React, { ReactNode, CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/utils/cn";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

// =====================================================
// TYPES
// =====================================================

/** Props truyền vào children (render props pattern) */
interface SortableItemRenderProps {
    /** Props để gắn vào drag handle (nút kéo) */
    dragHandleProps: {
        attributes: DraggableAttributes;
        listeners: SyntheticListenerMap | undefined;
    };
    /** Trạng thái đang được kéo */
    isDragging: boolean;
    /** Trạng thái có item khác đang hover lên */
    isOver: boolean;
    /** Ref để gắn vào DOM element gốc */
    setNodeRef: (node: HTMLElement | null) => void;
}

interface SortableItemProps {
    /** ID duy nhất của item (bắt buộc) */
    id: string;

    /** 
     * Children dạng render props 
     * Nhận vào các props cần thiết để render item
     */
    children: (props: SortableItemRenderProps) => ReactNode;

    /** Class CSS khi đang kéo */
    draggingClassName?: string;

    /** Class CSS mặc định */
    className?: string;

    /** Có disabled không */
    disabled?: boolean;
}

// =====================================================
// COMPONENT
// =====================================================

export function SortableItem({
    id,
    children,
    draggingClassName = "opacity-50 shadow-lg",
    className,
    disabled = false,
}: SortableItemProps) {

    // -------------------------------------------------
    // Hook useSortable - Lấy các props cần thiết
    // -------------------------------------------------
    const {
        attributes,     // Các thuộc tính ARIA cho accessibility
        listeners,      // Event listeners (onPointerDown, etc.)
        setNodeRef,     // Ref gắn vào DOM element
        transform,      // Transform CSS khi đang kéo
        transition,     // Transition CSS khi animation
        isDragging,     // true khi item đang được kéo
        isOver,         // true khi có item khác hover lên
    } = useSortable({
        id,
        disabled,
    });

    // -------------------------------------------------
    // Tính toán style cho animation
    // -------------------------------------------------
    const style: CSSProperties = {
        // Transform: di chuyển item theo vị trí chuột
        transform: CSS.Transform.toString(transform),
        // Transition: animation mượt khi kết thúc kéo
        transition: isDragging ? "none" : transition,
        // Z-index cao khi đang kéo để item nổi lên trên
        zIndex: isDragging ? 999 : undefined,
        // Position relative để z-index hoạt động
        position: "relative",
    };

    // -------------------------------------------------
    // RENDER - Sử dụng render props pattern
    // -------------------------------------------------
    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                className,
                // Thêm class khi đang kéo
                isDragging && draggingClassName
            )}
        >
            {/* Gọi children với các props cần thiết */}
            {children({
                dragHandleProps: {
                    attributes,
                    listeners,
                },
                isDragging,
                isOver,
                setNodeRef,
            })}
        </div>
    );
}

export default SortableItem;