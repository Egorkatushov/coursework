export function parseSQL(sqlContent) {
    const tables = [];
    const links = [];

    const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)\s*\(([^;]+)\)/gi;
    const foreignKeyRegex = /FOREIGN\s+KEY\s*\((\w+)\)\s*REFERENCES\s*(\w+)\s*\((\w+)\)/gi;
    const primaryKeyRegex = /PRIMARY\s+KEY\s*\(([^)]+)\)/i;

    let match;
    while ((match = createTableRegex.exec(sqlContent)) !== null) {
        const tableName = match[1];
        const tableContent = match[2];

        const columns = parseColumns(tableContent);

        const pkMatch = primaryKeyRegex.exec(tableContent);
        if (pkMatch) {
            const pkColumns = pkMatch[1].split(',').map(c => c.trim());
            pkColumns.forEach(pk => {
                const col = columns.find(c => c.name === pk);
                if (col) col.isPrimaryKey = true;
            });
        }

        tables.push({
            name: tableName,
            columns: columns
        });
    }

    for (const table of tables) {
        const fkRegex = new RegExp(`FOREIGN\\s+KEY\\s*\\((\\w+)\\)\\s*REFERENCES\\s*(\\w+)\\s*\\((\\w+)\\)`, 'gi');
        let fkMatch;

        const fullTableRegex = new RegExp(`CREATE\\s+TABLE\\s+${table.name}\\s*\\(([^;]+)\\)`, 'i');
        const tableMatch = fullTableRegex.exec(sqlContent);

        if (tableMatch) {
            const tableContent = tableMatch[1];
            while ((fkMatch = foreignKeyRegex.exec(tableContent)) !== null) {
                const [, fromColumn, toTable, toColumn] = fkMatch;

                if (tables.some(t => t.name === toTable)) {
                    links.push({
                        source: table.name,
                        target: toTable,
                        sourceColumn: fromColumn,
                        targetColumn: toColumn
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

    if (links.length === 0) {
        detectImplicitRelations(tables, links);
    }

    return { tables, links };
}

function parseColumns(tableContent) {
    const columns = [];

    const lines = tableContent.split(/\r?\n/);

    for (let line of lines) {
        line = line.trim();

        if (!line ||
            line.toUpperCase().startsWith('PRIMARY KEY') ||
            line.toUpperCase().startsWith('FOREIGN KEY') ||
            line.toUpperCase().startsWith('UNIQUE') ||
            line.toUpperCase().startsWith('CHECK') ||
            line.toUpperCase().startsWith('CONSTRAINT')) {
            continue;
        }

        line = line.replace(/,$/, '');

        const columnMatch = line.match(/^(\w+)\s+(\w+)(?:\([^)]+\))?(?:\s+(NOT\s+NULL))?(?:\s+DEFAULT\s+[^,]+)?/i);

        if (columnMatch) {
            const [, name, type] = columnMatch;
            const isNullable = !columnMatch[3];

            columns.push({
                name: name,
                type: type.toUpperCase(),
                isNullable: isNullable,
                isPrimaryKey: false,
                isForeignKey: false
            });
        }
    }

    return columns;
}

function detectImplicitRelations(tables, links) {
    for (const table of tables) {
        for (const column of table.columns) {
            if (column.name.endsWith('_id') && column.name !== 'id') {
                const targetTableName = column.name.replace(/_id$/, '');
                const targetTable = tables.find(t =>
                    t.name.toLowerCase() === targetTableName.toLowerCase() ||
                    t.name.toLowerCase() === targetTableName.toLowerCase() + 's'
                );

                if (targetTable) {
                    links.push({
                        source: table.name,
                        target: targetTable.name,
                        sourceColumn: column.name,
                        targetColumn: 'id'
                    });

                    column.isForeignKey = true;
                    column.references = { table: targetTable.name, column: 'id' };
                }
            }
        }
    }
}

export function validateSQL(sqlContent) {
    const errors = [];

    if (!sqlContent || sqlContent.trim().length === 0) {
        errors.push('SQL файл пуст');
        return errors;
    }

    const createTableCount = (sqlContent.match(/CREATE\s+TABLE/gi) || []).length;

    if (createTableCount === 0) {
        errors.push('Не найдено ни одного CREATE TABLE выражения');
    }

    const parenthesesBalance = (sqlContent.match(/\(/g) || []).length - (sqlContent.match(/\)/g) || []).length;
    if (parenthesesBalance !== 0) {
        errors.push(`Несбалансированные скобки: ${parenthesesBalance > 0 ? 'лишних открывающих' : 'лишних закрывающих'}`);
    }

    return errors;
}