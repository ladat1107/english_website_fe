// Hàm lấy tên viết tắt cho avatar từ tên đầy đủ ================================================================================   
export function getNameAvatar(name: string): string {
    if (!name) return '';

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase(); // Trường hợp chỉ có 1 từ → lấy 2 ký tự đầu
    }

    return (
        parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase()
    );
}


// Hàm xây dựng query string từ object params, bỏ qua các giá trị undefined/null/empty ============================================================
export const buildQueryString = (params?: Record<string, any>): string => {
    if (!params) return '';

    const validParams = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => [key, String(value)]);

    return validParams.length > 0 ? `?${new URLSearchParams(validParams).toString()}` : '';
};


// Hàm định dạng thời gian từ giây sang định dạng mm:ss =========================================================================
export const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Hàm lấy màu sắc tương ứng với điểm số (điểm 0-100) =================================================================================================
export const getScoreBadgeVariant = (score: number): 'success' | 'warning' | 'destructive' => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'destructive';
};