import { Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LinkIcon from '@mui/icons-material/Link';
import type { SqlTable } from '../../types';

interface SqlTableCardProps {
    table: SqlTable;
}

export function SqlTableCard({ table }: SqlTableCardProps) {
    return (
        <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h6" color="primary">
                    {table.name}
                </Typography>
                {table.columns.some((c) => c.isPrimaryKey) && (
                    <Chip icon={<VpnKeyIcon />} label="PRIMARY KEY" size="small" color="success" variant="outlined" />
                )}
                {table.columns.some((c) => c.isForeignKey) && (
                    <Chip icon={<LinkIcon />} label="FOREIGN KEYS" size="small" color="warning" variant="outlined" />
                )}
            </Box>

            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Поле</TableCell>
                        <TableCell>Тип</TableCell>
                        <TableCell>Ключ</TableCell>
                        <TableCell>Nullable</TableCell>
                        <TableCell>Связь</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {table.columns.map((col) => (
                        <TableRow
                            key={col.name}
                            sx={{
                                bgcolor: col.isPrimaryKey ? 'action.hover' : 'inherit',
                            }}
                        >
                            <TableCell>
                                <Typography fontFamily="monospace" fontWeight={col.isPrimaryKey ? 'bold' : 'normal'}>
                                    {col.name}
                                </Typography>
                            </TableCell>
                            <TableCell>{col.type}</TableCell>
                            <TableCell>
                                {col.isPrimaryKey && <Chip label="PK" size="small" color="success" />}
                                {col.isForeignKey && !col.isPrimaryKey && <Chip label="FK" size="small" color="warning" />}
                            </TableCell>
                            <TableCell>
                                {col.isNullable ? (
                                    <Chip label="Да" size="small" variant="outlined" />
                                ) : (
                                    <Chip label="Нет" size="small" color="error" variant="outlined" />
                                )}
                            </TableCell>
                            <TableCell>
                                {col.references && (
                                    <Chip
                                        label={`→ ${col.references.table}.${col.references.column}`}
                                        size="small"
                                        color="info"
                                        variant="outlined"
                                    />
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}