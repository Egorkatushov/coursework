import type { SwaggerSchema } from '../types';

export interface LoadResult {
    success: boolean;
    data?: SwaggerSchema;
    errors?: string[];
}

export class SwaggerService {
    static async loadFromUrl(url: string): Promise<LoadResult> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                return {
                    success: false,
                    errors: [`HTTP ошибка: ${response.status}`],
                };
            }
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                errors: ['Ошибка загрузки URL. Проверьте ссылку и CORS.'],
            };
        }
    }

    static loadFromJsonString(jsonString: string): LoadResult {
        try {
            const data = JSON.parse(jsonString) as SwaggerSchema;
            return { success: true, data };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
            return {
                success: false,
                errors: [`Ошибка парсинга JSON: ${message}`],
            };
        }
    }

    static loadFromFile(file: File): Promise<LoadResult> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target?.result as string) as SwaggerSchema;
                    resolve({ success: true, data });
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
                    resolve({
                        success: false,
                        errors: [`Ошибка в файле: ${message}`],
                    });
                }
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