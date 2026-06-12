export function formatJson(data: unknown, indent: number = 2): string {
    try {
        return JSON.stringify(data, null, indent);
    } catch (error) {
        return String(data);
    }
}

export function safeJsonParse<T = unknown>(jsonString: string): {
    success: boolean;
    data?: T;
    error?: string;
} {
    try {
        const parsed = JSON.parse(jsonString) as T;
        return { success: true, data: parsed };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Невалидный JSON';
        return { success: false, error: errorMessage };
    }
}

export function prettyPrintJson(data: unknown): string {
    return JSON.stringify(data, null, 2);
}

export function minifyJson(data: unknown): string {
    return JSON.stringify(data);
}

export function isValidJsonString(str: string): boolean {
    try {
        JSON.parse(str);
        return true;
    } catch {
        return false;
    }
}