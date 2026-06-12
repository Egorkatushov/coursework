import type { SwaggerSchema } from '../../types';

export interface ValidationError {
    field: string;
    message: string;
    severity: 'error' | 'warning';
}

export function validateSwaggerSchema(schema: SwaggerSchema | null): string[] {
    const errors: string[] = [];

    if (!schema) {
        errors.push('Схема пуста');
        return errors;
    }

    if (!schema.swagger && !('openapi' in schema)) {
        errors.push('Неизвестная версия спецификации (нет swagger или openapi)');
    }

    if (schema.swagger && !schema.swagger.startsWith('2.')) {
        errors.push(`Неподдерживаемая версия Swagger: ${schema.swagger}`);
    }

    if (!schema.paths || Object.keys(schema.paths).length === 0) {
        errors.push('Нет определений путей (paths)');
    }

    if (!schema.info?.title) {
        errors.push('Отсутствует название API (info.title)');
    }

    return errors;
}

export function isValidSwaggerSchema(schema: SwaggerSchema | null): boolean {
    return validateSwaggerSchema(schema).length === 0;
}