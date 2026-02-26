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

export const buildQueryString = (params?: Record<string, any>): string => {
    if (!params) return '';

    const validParams = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => [key, String(value)]);

    return validParams.length > 0 ? `?${new URLSearchParams(validParams).toString()}` : '';
};

export const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};