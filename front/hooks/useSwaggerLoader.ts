import { useState, useCallback } from 'react';
import { SwaggerService, LoadResult } from '../services/swaggerService';
import { validateSwaggerSchema } from '../utils/validators/swaggerValidator';
import type { SwaggerSchema } from '../types';

interface UseSwaggerLoaderReturn {
    schema: SwaggerSchema | null;
    isLoading: boolean;
    error: string | null;
    validationErrors: string[];
    loadFromUrl: (url: string) => Promise<void>;
    loadFromJsonString: (jsonString: string) => void;
    loadFromFile: (file: File) => Promise<void>;
    clear: () => void;
}

export function useSwaggerLoader(): UseSwaggerLoaderReturn {
    const [schema, setSchema] = useState<SwaggerSchema | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const processResult = useCallback((result: LoadResult) => {
        if (result.success && result.data) {
            const errors = validateSwaggerSchema(result.data);
            setValidationErrors(errors);
            setSchema(result.data);
            setError(null);
        } else {
            setSchema(null);
            setError(result.errors?.[0] || 'Неизвестная ошибка');
            setValidationErrors([]);
        }
        setIsLoading(false);
    }, []);

    const loadFromUrl = useCallback(async (url: string) => {
        if (!url.trim()) return;
        setIsLoading(true);
        setError(null);
        setValidationErrors([]);
        const result = await SwaggerService.loadFromUrl(url);
        processResult(result);
    }, [processResult]);

    const loadFromJsonString = useCallback((jsonString: string) => {
        if (!jsonString.trim()) return;
        setIsLoading(true);
        setError(null);
        setValidationErrors([]);
        const result = SwaggerService.loadFromJsonString(jsonString);
        processResult(result);
    }, [processResult]);

    const loadFromFile = useCallback(async (file: File) => {
        setIsLoading(true);
        setError(null);
        setValidationErrors([]);
        const result = await SwaggerService.loadFromFile(file);
        processResult(result);
    }, [processResult]);

    const clear = useCallback(() => {
        setSchema(null);
        setError(null);
        setValidationErrors([]);
        setIsLoading(false);
    }, []);

    return {
        schema,
        isLoading,
        error,
        validationErrors,
        loadFromUrl,
        loadFromJsonString,
        loadFromFile,
        clear,
    };
}