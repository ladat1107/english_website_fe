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