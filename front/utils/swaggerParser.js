// utils/swaggerParser.js

/**
 * Парсит Swagger схему и возвращает структурированные данные
 */
export function parseSwaggerSchema(schema) {
    if (!schema) return null;

    return {
        info: schema.info || {},
        host: schema.host || '',
        basePath: schema.basePath || '',
        schemes: schema.schemes || [],
        tags: schema.tags || [],
        paths: parsePaths(schema.paths || {}, schema),
        definitions: parseDefinitions(schema.definitions || schema.components?.schemas || {}),
        securityDefinitions: schema.securityDefinitions || schema.components?.securitySchemes || {}
    };
}

function parsePaths(paths, fullSchema) {
    const result = {};

    Object.entries(paths).forEach(([path, methods]) => {
        result[path] = {};

        Object.entries(methods).forEach(([method, details]) => {
            result[path][method] = {
                summary: details.summary || '',
                description: details.description || '',
                operationId: details.operationId || '',
                tags: details.tags || [],
                parameters: parseParameters(details.parameters || [], fullSchema),
                requestBody: parseRequestBody(details.requestBody || details.parameters, fullSchema),
                responses: parseResponses(details.responses || {}, fullSchema),
                security: details.security || [],
                deprecated: details.deprecated || false,
                consumes: details.consumes || [],
                produces: details.produces || []
            };
        });
    });

    return result;
}

function parseParameters(parameters, fullSchema) {
    if (!Array.isArray(parameters)) return [];

    return parameters.map(param => ({
        name: param.name || '',
        in: param.in || 'body',
        description: param.description || '',
        required: param.required || false,
        type: param.type || param.schema?.type || 'object',
        schema: param.schema ? safeResolveRefs(param.schema, fullSchema) : null,
        example: param.example || param.schema?.example,
        enum: param.enum || [],
        format: param.format || '',
        default: param.default
    }));
}

function parseRequestBody(body, fullSchema) {
    if (!body) return null;

    // Для Swagger 2.0 параметры в body
    if (Array.isArray(body)) {
        const bodyParam = body.find(p => p.in === 'body');
        if (bodyParam && bodyParam.schema) {
            return {
                description: bodyParam.description,
                required: bodyParam.required,
                content: {
                    'application/json': {
                        schema: safeResolveRefs(bodyParam.schema, fullSchema)
                    }
                }
            };
        }
        return null;
    }

    // Для OpenAPI 3.0
    return {
        description: body.description || '',
        required: body.required || false,
        content: parseContent(body.content || {}, fullSchema)
    };
}

function parseContent(content, fullSchema) {
    const result = {};
    Object.entries(content).forEach(([mimeType, mimeData]) => {
        result[mimeType] = {
            schema: mimeData.schema ? safeResolveRefs(mimeData.schema, fullSchema) : null
        };
    });
    return result;
}

function parseResponses(responses, fullSchema) {
    const result = {};

    Object.entries(responses).forEach(([code, response]) => {
        result[code] = {
            description: response.description || '',
            schema: response.schema ? safeResolveRefs(response.schema, fullSchema) : null,
            content: response.content ? parseContent(response.content, fullSchema) : null,
            headers: response.headers || {}
        };
    });

    return result;
}

function parseDefinitions(definitions) {
    const result = {};

    Object.entries(definitions).forEach(([name, definition]) => {
        result[name] = {
            type: definition.type || 'object',
            properties: parseProperties(definition.properties || {}, definition),
            required: definition.required || [],
            description: definition.description || '',
            example: definition.example || null
        };
    });

    return result;
}

function parseProperties(properties, parentDefinition) {
    const result = {};

    Object.entries(properties).forEach(([name, prop]) => {
        result[name] = {
            type: prop.type || 'any',
            description: prop.description || '',
            required: parentDefinition.required?.includes(name) || false,
            format: prop.format || '',
            example: prop.example || null,
            enum: prop.enum || [],
            items: prop.items ? safeResolveRefs(prop.items, parentDefinition) : null,
            $ref: prop.$ref || null
        };
    });

    return result;
}

// БЕЗОПАСНАЯ версия resolveRefs с защитой от циклических ссылок
const visitedRefs = new WeakSet();

function safeResolveRefs(obj, fullSchema, depth = 0) {
    // Защита от слишком глубокой рекурсии
    if (depth > 20) return obj;

    if (!obj || typeof obj !== 'object') return obj;

    // Защита от циклических ссылок
    if (visitedRefs.has(obj)) {
        return { __circular: true };
    }

    // Обработка $ref
    if (obj.$ref) {
        visitedRefs.add(obj);
        const refPath = obj.$ref.replace('#/', '').split('/');
        let resolved = fullSchema;
        for (const segment of refPath) {
            resolved = resolved?.[segment];
            if (!resolved) break;
        }
        visitedRefs.delete(obj);
        return resolved || obj;
    }

    // Рекурсивно обходим объект
    if (Array.isArray(obj)) {
        return obj.map(item => safeResolveRefs(item, fullSchema, depth + 1));
    }

    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        // Пропускаем очень большие объекты
        if (key === 'definitions' || key === 'components') {
            result[key] = value;
            continue;
        }
        result[key] = safeResolveRefs(value, fullSchema, depth + 1);
    }
    return result;
}

/**
 * Валидация Swagger схемы
 */
export function validateSwaggerSchema(schema) {
    const errors = [];

    if (!schema) {
        errors.push('Схема пуста');
        return errors;
    }

    if (!schema.swagger && !schema.openapi) {
        errors.push('Неизвестная версия спецификации (нет swagger или openapi)');
    }

    if (!schema.paths || Object.keys(schema.paths).length === 0) {
        errors.push('Нет определений путей (paths)');
    }

    if (schema.swagger && !schema.swagger.startsWith('2.')) {
        errors.push(`Неподдерживаемая версия Swagger: ${schema.swagger}`);
    }

    return errors;
}