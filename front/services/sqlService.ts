import type { SqlParseResult } from '../types';

export interface SqlLoadResult {
    success: boolean;
    data?: SqlParseResult;
    errors?: string[];
}

export class SqlService {
    static async loadFromFile(file: File): Promise<SqlLoadResult> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = async (ev) => {
                const sqlContent = ev.target?.result as string;

                // Динамический импорт парсера (для code splitting)
                const { parseSQL, validateSQL } = await import('../utils/parsers/sqlParser');

                const errors = validateSQL(sqlContent);
                if (errors.length > 0) {
                    resolve({
                        success: false,
                        errors,
                    });
                    return;
                }

                const data = parseSQL(sqlContent);
                resolve({ success: true, data });
            };
            reader.onerror = () => {
                resolve({
                    success: false,
                    errors: ['Ошибка при чтении файла'],
                });
            };
            reader.readAsText(file);
        });
    }
}