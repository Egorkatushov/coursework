export interface SwaggerInfo {
    title: string
    description?: string
    version?: string
    termsOfService?: string
    contact?: {
        name?: string
        email?: string
        url?: string
    }
    license?: {
        name: string
        url?: string
    }
}

export interface SwaggerParameter {
    name: string
    in: 'path' | 'query' | 'body' | 'header' | 'formData'
    description?: string
    required: boolean
    type?: string
    format?: string
    items?: {
        type: string
        enum?: string[]
    }
    schema?: {
        type?: string
        $ref?: string
    }
    enum?: string[]
    default?: unknown
}

export interface SwaggerResponse {
    description: string
    schema?: {
        type?: string
        $ref?: string
        items?: unknown
    }
    content?: Record<string, { schema?: unknown }>
}

export interface SwaggerEndpoint {
    summary?: string
    description?: string
    operationId?: string
    tags?: string[]
    parameters?: SwaggerParameter[]
    requestBody?: {
        description?: string
        content?: Record<string, { schema?: unknown }>
        required?: boolean
    }
    responses?: Record<string, SwaggerResponse>
    security?: Record<string, string[]>[]
    deprecated?: boolean
    consumes?: string[]
    produces?: string[]
}

export interface SwaggerProperty {
    type: string
    description?: string
    format?: string
    example?: unknown
    enum?: string[]
    items?: SwaggerProperty
    $ref?: string
    required?: boolean
}

export interface SwaggerDefinition {
    type: 'object' | 'array' | 'string' | 'number' | 'integer' | 'boolean'
    properties?: Record<string, SwaggerProperty>
    required?: string[]
    description?: string
    example?: unknown
    items?: SwaggerProperty
    xml?: { name?: string }
}

export interface SwaggerSchema {
    swagger: string
    info: SwaggerInfo
    host?: string
    basePath?: string
    schemes?: string[]
    tags?: { name: string; description?: string; externalDocs?: { description: string; url: string } }[]
    paths: Record<string, Record<string, SwaggerEndpoint>>
    definitions?: Record<string, SwaggerDefinition>
    securityDefinitions?: Record<string, unknown>
    externalDocs?: { description: string; url: string }
}

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

export interface SqlColumn {
    name: string
    type: string
    isNullable: boolean
    isPrimaryKey: boolean
    isForeignKey: boolean
    references?: {
        table: string
        column: string
    }
}

export interface SqlTable {
    name: string
    columns: SqlColumn[]
}

export interface SqlLink {
    source: string
    target: string
    sourceColumn: string
    targetColumn: string
}

export interface SqlParseResult {
    tables: SqlTable[]
    links: SqlLink[]
}

export interface FavoriteItem {
    id: string
    name: string
    schema: SwaggerSchema
}

export interface AddFavoriteRequest {
    name: string
    schema_data: SwaggerSchema
}

export interface AddFavoriteResponse extends FavoriteItem {}

export type FavoritesResponse = FavoriteItem[]