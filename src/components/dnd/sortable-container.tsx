/**
 * SortableContainer - Component bọc danh sách có thể sắp xếp
 * 
 * @description
 * Đây là component DÙNG CHUNG cho tất cả các danh sách cần kéo thả.
 * Bạn có thể tái sử dụng cho: Questions, Scripts, hoặc bất kỳ danh sách nào khác.
 * 
 * @example
 * <SortableContainer items={items} onReorder={handleReorder}>
 *   {items.map(item => <YourItem key={item.id} />)}
 * </SortableContainer>
 */

import React, { ReactNode, useCallback } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToHorizontalAxis } from "@dnd-kit/modifiers";

// =====================================================
// TYPES - Định nghĩa kiểu dữ liệu
// =====================================================

/** Hướng sắp xếp: dọc hoặc ngang */
type SortDirection = "vertical" | "horizontal";

/** Item cần có id để dnd-kit nhận diện */
interface SortableItemData {
    id: string;
    [key: string]: unknown;
}

interface SortableContainerProps<T extends SortableItemData> {
    items: T[]; /** Danh sách items cần sắp xếp - mỗi item PHẢI có trường 'id' */
    onReorder: (oldIndex: number, newIndex: number) => void;  /** Callback khi kết thúc kéo thả, trả về index cũ và mới */
    children: ReactNode;  /** Nội dung bên trong (các item con) */
    direction?: SortDirection;  /** Hướng sắp xếp: 'vertical' (mặc định) hoặc 'horizontal' */
    activationDistance?: number;    /** Khoảng cách tối thiểu (px) trước khi bắt đầu kéo - tránh click nhầm */
    className?: string; /** Class name cho container */

    onDragStart?: (itemId: string) => void;  /** Callback khi bắt đầu kéo (tùy chọn) */
    onDragEnd?: () => void;  /** Callback khi kết thúc kéo (tùy chọn) */

    dragOverlay?: ReactNode;   /** Component hiển thị khi đang kéo (drag overlay) */
}

// =====================================================
// COMPONENT CHÍNH
// =====================================================

export function SortableContainer<T extends SortableItemData>({
    items,
    onReorder,
    children,
    direction = "vertical",
    activationDistance = 8,
    className,
    onDragStart,
    onDragEnd,
    dragOverlay,
}: SortableContainerProps<T>) {

    // -------------------------------------------------
    // Cấu hình Sensors - Xử lý input từ người dùng
    // -------------------------------------------------
    const sensors = useSensors(
        // PointerSensor: Hỗ trợ chuột và touch trên mobile
        useSensor(PointerSensor, {
            activationConstraint: {
                // Phải kéo ít nhất 8px mới bắt đầu drag
                // Giúp tránh trigger drag khi user chỉ muốn click
                distance: activationDistance,
            },
        }),
        // KeyboardSensor: Hỗ trợ điều khiển bằng bàn phím (accessibility)
        // User có thể dùng Space để chọn, mũi tên để di chuyển
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // -------------------------------------------------
    // Xác định strategy và modifier dựa trên hướng
    // -------------------------------------------------

    // Strategy: Thuật toán sắp xếp
    const sortingStrategy = direction === "vertical"
        ? verticalListSortingStrategy   // Danh sách dọc
        : horizontalListSortingStrategy; // Danh sách ngang

    // Modifier: Giới hạn hướng kéo
    const dragModifier = direction === "vertical"
        ? restrictToVerticalAxis   // Chỉ kéo lên/xuống
        : restrictToHorizontalAxis; // Chỉ kéo trái/phải

    // -------------------------------------------------
    // Handler khi bắt đầu kéo
    // -------------------------------------------------
    const handleDragStart = useCallback(
        (event: DragStartEvent) => {
            // Gọi callback nếu có
            onDragStart?.(event.active.id as string);
        },
        [onDragStart]
    );

    // -------------------------------------------------
    // Handler khi kết thúc kéo
    // -------------------------------------------------
    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;

            // Kiểm tra: có vị trí đích và khác vị trí ban đầu
            if (over && active.id !== over.id) {
                // Tìm index cũ và mới trong mảng items
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                // Gọi callback để component cha cập nhật state
                if (oldIndex !== -1 && newIndex !== -1) {
                    onReorder(oldIndex, newIndex);
                }
            }

            // Gọi callback kết thúc nếu có
            onDragEnd?.();
        },
        [items, onReorder, onDragEnd]
    );

    // -------------------------------------------------
    // RENDER
    // -------------------------------------------------
    return (
        <DndContext
            sensors={sensors}
            // closestCenter: Thuật toán phát hiện va chạm - dùng tâm của item
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            // Modifier giới hạn hướng kéo
            modifiers={[dragModifier]}
        >
            {/* SortableContext cung cấp thông tin về thứ tự cho các item con */}
            <SortableContext
                // Danh sách ID của các item
                items={items.map((item) => item.id)}
                // Thuật toán tính toán vị trí
                strategy={sortingStrategy}
            >
                <div className={className}>
                    {children}
                </div>
            </SortableContext>

            {/* DragOverlay: Hiển thị preview khi đang kéo (tùy chọn) */}
            {dragOverlay && (
                <DragOverlay>
                    {dragOverlay}
                </DragOverlay>
            )}
        </DndContext>
    );
}

export default SortableContainer;