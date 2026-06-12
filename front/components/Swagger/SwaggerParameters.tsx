import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Chip,
    Paper,
} from '@mui/material';
import type { SwaggerParameter } from '../../types';

interface SwaggerParametersProps {
    parameters: SwaggerParameter[];
}

export function SwaggerParameters({ parameters }: SwaggerParametersProps) {
    if (!parameters || parameters.length === 0) {
        return null;
    }

    return (
        <Paper sx={{ p: 2, mb: 2 }} variant="outlined">
            <Typography variant="subtitle1" gutterBottom>
                Параметры запроса
            </Typography>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Имя</TableCell>
                        <TableCell>В</TableCell>
                        <TableCell>Тип</TableCell>
                        <TableCell>Обязательный</TableCell>
                        <TableCell>Описание</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {parameters.map((param, idx) => (
                        <TableRow key={idx}>
                            <TableCell>
                                <Typography fontFamily="monospace">{param.name}</Typography>
                            </TableCell>
                            <TableCell>
                                <Chip label={param.in} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell>{param.type || param.schema?.type || 'object'}</TableCell>
                            <TableCell>
                                {param.required ? (
                                    <Chip label="Да" color="error" size="small" />
                                ) : (
                                    <Chip label="Нет" variant="outlined" size="small" />
                                )}
                            </TableCell>
                            <TableCell>{param.description || '-'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}