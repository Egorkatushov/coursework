'use client';
import { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Collapse
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SchemaIcon from '@mui/icons-material/Schema';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { parseSwaggerSchema } from '../utils/swaggerParser';

export default function SwaggerViewer({ data }) {
  const [expandedDef, setExpandedDef] = useState(null);

  if (!data) return null;

  const schema = parseSwaggerSchema(data);

  if (!schema.paths || Object.keys(schema.paths).length === 0) {
    return (
        <Paper sx={{ p: 3, mt: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Нет данных для отображения. Убедитесь, что схема содержит определения paths.
          </Typography>
        </Paper>
    );
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getMethodColor = (method) => {
    switch (method.toLowerCase()) {
      case 'get': return 'primary';
      case 'post': return 'success';
      case 'put': return 'warning';
      case 'delete': return 'error';
      case 'patch': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (code) => {
    if (code.startsWith('2')) return 'success';
    if (code.startsWith('4')) return 'warning';
    if (code.startsWith('5')) return 'error';
    return 'default';
  };

  return (
      <Box sx={{ mt: 3 }}>
        {/* Информация об API */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {schema.info.title || 'API Documentation'}
          </Typography>
          {schema.info.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {schema.info.description}
              </Typography>
          )}
          {schema.info.version && (
              <Chip label={`Версия: ${schema.info.version}`} size="small" variant="outlined" />
          )}
          {schema.host && (
              <Chip label={`Host: ${schema.host}`} size="small" variant="outlined" sx={{ ml: 1 }} />
          )}
        </Paper>

        {/* Эндпоинты */}
        <Typography variant="h6" gutterBottom>Эндпоинты</Typography>

        {Object.entries(schema.paths).map(([path, methods]) => (
            Object.entries(methods).map(([method, details]) => (
                <Accordion key={`${path}-${method}`} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <Chip
                          label={method.toUpperCase()}
                          color={getMethodColor(method)}
                          size="small"
                          sx={{ fontWeight: 'bold', minWidth: 70 }}
                      />
                      <Typography sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        {path}
                      </Typography>
                      {details.deprecated && (
                          <Chip label="Deprecated" color="error" size="small" variant="outlined" />
                      )}
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails>
                    {/* Описание */}
                    {details.summary && (
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          {details.summary}
                        </Typography>
                    )}
                    {details.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {details.description}
                        </Typography>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {/* Параметры запроса */}
                    {details.parameters && details.parameters.length > 0 && (
                        <>
                          <Typography variant="subtitle1" gutterBottom>Параметры запроса</Typography>
                          <Table size="small" sx={{ mb: 2 }}>
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
                              {details.parameters.map((param, idx) => (
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
                        </>
                    )}

                    {/* Тело запроса */}
                    {details.requestBody && (
                        <>
                          <Typography variant="subtitle1" gutterBottom>Тело запроса</Typography>
                          <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'action.hover' }}>
                            {details.requestBody.description && (
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  {details.requestBody.description}
                                </Typography>
                            )}
                            <Box sx={{ position: 'relative' }}>
                      <pre style={{ margin: 0, overflow: 'auto', fontSize: '12px' }}>
                        {JSON.stringify(details.requestBody.content, null, 2)}
                      </pre>
                              <Tooltip title="Копировать">
                                <IconButton
                                    size="small"
                                    onClick={() => handleCopy(JSON.stringify(details.requestBody.content, null, 2))}
                                    sx={{ position: 'absolute', top: 5, right: 5 }}
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Paper>
                        </>
                    )}

                    {/* Ответы */}
                    <Typography variant="subtitle1" gutterBottom>Ответы</Typography>
                    {Object.entries(details.responses || {}).map(([code, response]) => (
                        <Paper key={code} variant="outlined" sx={{ p: 2, mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Chip
                                label={code}
                                size="small"
                                color={getStatusColor(code)}
                                variant={code.startsWith('2') ? 'filled' : 'outlined'}
                            />
                            <Typography variant="subtitle2">{response.description}</Typography>
                          </Box>

                          {(response.schema || response.content) && (
                              <Box sx={{ position: 'relative', bgcolor: 'background.paper', p: 1, borderRadius: 1 }}>
                      <pre style={{ margin: 0, overflow: 'auto', fontSize: '12px' }}>
                        {JSON.stringify(response.schema || response.content, null, 2)}
                      </pre>
                                <Tooltip title="Копировать">
                                  <IconButton
                                      size="small"
                                      onClick={() => handleCopy(JSON.stringify(response.schema || response.content, null, 2))}
                                      sx={{ position: 'absolute', top: 5, right: 5 }}
                                  >
                                    <ContentCopyIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                          )}
                        </Paper>
                    ))}
                  </AccordionDetails>
                </Accordion>
            ))
        ))}

        {/* Схемы данных (definitions) */}
        {Object.keys(schema.definitions).length > 0 && (
            <>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Схемы данных
              </Typography>

              {Object.entries(schema.definitions).map(([name, definition]) => (
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
                          {Object.entries(definition.properties).map(([propName, prop]) => (
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
            </>
        )}
      </Box>
  );
}