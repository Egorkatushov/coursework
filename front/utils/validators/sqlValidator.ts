export interface SqlValidationError {
    line?: number;
    message: string;
    severity: 'error' | 'warning';
}

export function validateSQLFile(file: File): Promise<string[]> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            const errors = validateSQL(content);
            resolve(errors);
        };
        reader.onerror = () => {
            resolve(['Ошибка при чтении файла']);
        };
        reader.readAsText(file);
    });
}

export function validateSQL(sqlContent: string): string[] {
    const errors: string[] = [];

    if (!sqlContent || sqlContent.trim().length === 0) {
        errors.push('SQL файл пуст');
        return errors;
    }

    const createTableCount = (sqlContent.match(/CREATE\s+TABLE/gi) || []).length;
    if (createTableCount === 0) {
        errors.push('Не найдено ни одного CREATE TABLE выражения');
    }

    const openParens = (sqlContent.match(/\(/g) || []).length;
    const closeParens = (sqlContent.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
        errors.push(`Несбалансированные скобки: открывающих ${openParens}, закрывающих ${closeParens}`);
    }

    return errors;
}

export function hasTables(sqlContent: string): boolean {
    return (sqlContent.match(/CREATE\s+TABLE/gi) || []).length > 0;
}