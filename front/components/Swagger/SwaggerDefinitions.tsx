import { useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchemaIcon from '@mui/icons-material/Schema';
import type { SwaggerDefinition } from '../../types';

interface SwaggerDefinitionsProps {
    definitions: Record<string, SwaggerDefinition>;
}

export function SwaggerDefinitions({ definitions }: SwaggerDefinitionsProps) {
    if (!definitions || Object.keys(definitions).length === 0) {
        return null;
    }

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
                Схемы данных
            </Typography>

            {Object.entries(definitions).map(([name, definition]) => (
                <Accordion key={name} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SchemaIcon color="primary" />
                            <Typography fontWeight="bold">{name}</Typography>
                            <Chip label={definition.type} size="small" variant="outlined" />
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        {definition.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {definition.description}
                            </Typography>
                        )}

                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Свойство</TableCell>
                                    <TableCell>Тип</TableCell>
                                    <TableCell>Обязательное</TableCell>
                                    <TableCell>Описание</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(definition.properties || {}).map(([propName, prop]) => (
                                    <TableRow key={propName}>
                                        <TableCell>
                                            <Typography fontFamily="monospace">{propName}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            {prop.type}
                                            {prop.format && ` (${prop.format})`}
                                            {prop.items && `[]`}
                                        </TableCell>
                                        <TableCell>
                                            {prop.required ? (
                                                <Chip label="Да" color="error" size="small" />
                                            ) : (
                                                <Chip label="Нет" variant="outlined" size="small" />
                                            )}
                                        </TableCell>
                                        <TableCell>{prop.description || '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
}