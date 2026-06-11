export async function copyToClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text)
        alert('Скопировано!')
    } catch {
        alert('Не удалось скопировать')
    }
}