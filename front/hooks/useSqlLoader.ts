import { useState, useCallback } from 'react';
import { SqlService } from '../services/sqlService';
import type { SqlParseResult } from '../types';

interface UseSqlLoaderReturn {
    result: SqlParseResult | null;
    isLoading: boolean;
    error: string | null;
    loadFromFile: (file: File) => Promise<void>;
    clear: () => void;
}

export function useSqlLoader(): UseSqlLoaderReturn {
    const [result, setResult] = useState<SqlParseResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const loadFromFile = useCallback(async (file: File) => {
        setIsLoading(true);
        setError(null);

        const loadResult = await SqlService.loadFromFile(file);

        if (loadResult.success && loadResult.data) {
            setResult(loadResult.data);
        } else {
            setError(loadResult.errors?.[0] || 'Неизвестная ошибка');
            setResult(null);
        }
        setIsLoading(false);
    }, []);

    const clear = useCallback(() => {
        setResult(null);
        setError(null);
        setIsLoading(false);
    }, []);

    return {
        result,
        isLoading,
        error,
        loadFromFile,
        clear,
    };
}