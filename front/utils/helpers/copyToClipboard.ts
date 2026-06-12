export async function copyToClipboard(text: string): Promise<boolean> {
    // Современный метод (Clipboard API)
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error('Clipboard API failed:', error);
            return fallbackCopy(text);
        }
    }

    // Fallback для старых браузеров
    return fallbackCopy(text);
}

function fallbackCopy(text: string): boolean {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);

    textarea.select();
    textarea.setSelectionRange(0, text.length);

    let success = false;
    try {
        success = document.execCommand('copy');
    } catch (err) {
        console.error('Fallback copy failed:', err);
    }

    document.body.removeChild(textarea);
    return success;
}

export async function copyToClipboardWithNotification(text: string): Promise<void> {
    const success = await copyToClipboard(text);

    if (success) {
        alert('Скопировано в буфер обмена!');
    } else {
        alert('Не удалось скопировать текст');
    }
}