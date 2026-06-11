import type { SqlTable, SqlLink, SqlColumn, SqlParseResult } from '../types';

export function parseSQL(sqlContent: string): SqlParseResult {
    const tables: SqlTable[] = [];
    const links: SqlLink[] = [];

    const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)\s*\(([^;]+)\)/gi;
    const foreignKeyRegex = /FOREIGN\s+KEY\s*\((\w+)\)\s*REFERENCES\s*(\w+)\s*\((\w+)\)/gi;
    const primaryKeyRegex = /PRIMARY\s+KEY\s*\(([^)]+)\)/i;
    const primaryKeyInlineRegex = /(\w+)\s+\w+\s+PRIMARY\s+KEY/i;
    const notNullRegex = /NOT\s+NULL/i;

    let match;
    while ((match = createTableRegex.exec(sqlContent)) !== null) {
        const tableName = match[1];
        const tableContent = match[2];
        const columns = parseColumns(tableContent, notNullRegex, primaryKeyInlineRegex);

        const pkMatch = primaryKeyRegex.exec(tableContent);
        if (pkMatch) {
            const pkColumns = pkMatch[1].split(',').map(c => c.trim());
            pkColumns.forEach(pk => {
                const col = columns.find(c => c.name === pk);
                if (col) col.isPrimaryKey = true;
            });
        }

        tables.push({ name: tableName, columns });
    }

    for (const table of tables) {
        const fullTableRegex = new RegExp(`CREATE\\s+TABLE\\s+${table.name}\\s*\\(([^;]+)\\)`, 'i');
        const tableMatch = fullTableRegex.exec(sqlContent);

        if (tableMatch) {
            const tableContent = tableMatch[1];
            let fkMatch;
            const fkRegex = new RegExp(foreignKeyRegex.source, 'gi');

            while ((fkMatch = fkRegex.exec(tableContent)) !== null) {
                const [, fromColumn, toTable, toColumn] = fkMatch;
                if (tables.some(t => t.name === toTable)) {
                    links.push({
                        source: table.name,
                        target: toTable,
                        sourceColumn: fromColumn,
                        targetColumn: toColumn,
                    });
                    const column = table.columns.find(c => c.name === fromColumn);
                    if (column) {
                        column.isForeignKey = true;
                        column.references = { table: toTable, column: toColumn };
                    }
                }
            }
        }
    }

    detectImplicitRelations(tables, links);

    return { tables, links };
}

function parseColumns(
    tableContent: string,
    notNullRegex: RegExp,
    primaryKeyInlineRegex: RegExp
): SqlColumn[] {
    const columns: SqlColumn[] = [];
    const lines = tableContent.split(/\r?\n/);

    for (let line of lines) {
        line = line.trim();

        if (
            !line ||
            line.toUpperCase().startsWith('PRIMARY KEY') ||
            line.toUpperCase().startsWith('FOREIGN KEY') ||
            line.toUpperCase().startsWith('UNIQUE') ||
            line.toUpperCase().startsWith('CHECK') ||
            line.toUpperCase().startsWith('CONSTRAINT')
        ) {
            continue;
        }

        line = line.replace(/,$/, '');

        const isPrimaryKeyInline = primaryKeyInlineRegex.test(line);

        const isNotNull = notNullRegex.test(line);

        let cleanLine = line
            .replace(/\s+PRIMARY\s+KEY/i, '')
            .replace(/\s+NOT\s+NULL/i, '')
            .replace(/\s+NULL/i, '')
            .replace(/\s+AUTO_INCREMENT/i, '')
            .replace(/\s+UNIQUE/i, '');

        const columnMatch = cleanLine.match(/^(\w+)\s+(\w+)(?:\([^)]+\))?/i);

        if (columnMatch) {
            const [, name, type] = columnMatch;
            columns.push({
                name,
                type: type.toUpperCase(),
                isNullable: !isNotNull,
                isPrimaryKey: isPrimaryKeyInline,
                isForeignKey: false,
            });
        } else {

            const altMatch = line.match(/^(\w+)\s+(\w+)(?:\([^)]+\))?/i);
            if (altMatch) {
                const [, name, type] = altMatch;
                columns.push({
                    name,
                    type: type.toUpperCase(),
                    isNullable: !isNotNull,
                    isPrimaryKey: isPrimaryKeyInline,
                    isForeignKey: false,
                });
            }
        }
    }

    return columns;
}

function detectImplicitRelations(tables: SqlTable[], links: SqlLink[]): void {
    for (const table of tables) {
        for (const column of table.columns) {
            if (column.name.endsWith('_id') && column.name !== 'id' && !column.isForeignKey) {
                let targetTableName = column.name.replace(/_id$/, '');

                const targetTable = tables.find(
                    t =>
                        t.name.toLowerCase() === targetTableName.toLowerCase() ||
                        t.name.toLowerCase() === targetTableName.toLowerCase() + 's'
                );

                if (targetTable && !links.some(l => l.source === table.name && l.target === targetTable.name)) {
                    links.push({
                        source: table.name,
                        target: targetTable.name,
                        sourceColumn: column.name,
                        targetColumn: 'id',
                    });
                    column.isForeignKey = true;
                    column.references = { table: targetTable.name, column: 'id' };
                }
            }
        }
    }
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