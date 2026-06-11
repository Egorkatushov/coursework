import type { SwaggerSchema, SwaggerEndpoint, SwaggerDefinition } from '../types';

export interface ParsedSwagger {
    info: {
        title: string
        description: string
        version: string
    }
    host: string
    basePath: string
    schemes: string[]
    paths: Record<string, Record<string, SwaggerEndpoint>>
    definitions: Record<string, SwaggerDefinition>
    tags: { name: string; description?: string }[]
}

export function parseSwaggerSchema(schema: SwaggerSchema | null): ParsedSwagger | null {
    if (!schema) {
        return null;
    }

    return {
        info: {
            title: schema.info?.title || 'API Documentation',
            description: schema.info?.description || '',
            version: schema.info?.version || '1.0.0',
        },
        host: schema.host || '',
        basePath: schema.basePath || '',
        schemes: schema.schemes || ['https', 'http'],
        paths: parsePaths(schema.paths || {}),
        definitions: schema.definitions || {},
        tags: schema.tags || [],
    };
}

function parsePaths(
    paths: Record<string, Record<string, SwaggerEndpoint>>
): Record<string, Record<string, SwaggerEndpoint>> {
    const result: Record<string, Record<string, SwaggerEndpoint>> = {};

    const pathEntries = Object.entries(paths);
    for (let i = 0; i < pathEntries.length; i++) {
        const [path, methods] = pathEntries[i];
        result[path] = {};

        const methodEntries = Object.entries(methods);
        for (let j = 0; j < methodEntries.length; j++) {
            const [method, details] = methodEntries[j];
            result[path][method] = {
                summary: details.summary || '',
                description: details.description || '',
                operationId: details.operationId || '',
                tags: details.tags || [],
                parameters: details.parameters || [],
                responses: details.responses || {},
                security: details.security || [],
                deprecated: details.deprecated || false,
            };
        }
    }

    return result;
}

export function getMethodColor(method: string): 'primary' | 'success' | 'warning' | 'error' | 'default' {
    const methodLower = method.toLowerCase();

    if (methodLower === 'get') {
        return 'primary';
    }
    if (methodLower === 'post') {
        return 'success';
    }
    if (methodLower === 'put') {
        return 'warning';
    }
    if (methodLower === 'delete') {
        return 'error';
    }
    return 'default';
}

export function getStatusColor(code: string): 'success' | 'warning' | 'error' | 'default' {
    if (code.startsWith('2')) {
        return 'success';
    }
    if (code.startsWith('4')) {
        return 'warning';
    }
    if (code.startsWith('5')) {
        return 'error';
    }
    return 'default';
}

export function validateSwagger(schema: unknown): string[] {
    const errors: string[] = [];

    if (!schema) {
        errors.push('Схема пуста');
        return errors;
    }

    const typedSchema = schema as SwaggerSchema;

    if (!typedSchema.swagger && !('openapi' in typedSchema)) {
        errors.push('Неизвестная версия спецификации (нет swagger или openapi)');
    }

    if (!typedSchema.paths || Object.keys(typedSchema.paths).length === 0) {
        errors.push('Нет определений путей (paths)');
    }

    return errors;
}