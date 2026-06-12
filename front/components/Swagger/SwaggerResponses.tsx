import { Box, Typography, Chip, Paper, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { getStatusColor } from '../../utils/parsers/swaggerParser';
import type { SwaggerResponse } from '../../types';

interface SwaggerResponsesProps {
    responses: Record<string, SwaggerResponse>;
}

export function SwaggerResponses({ responses }: SwaggerResponsesProps) {
    if (!responses || Object.keys(responses).length === 0) {
        return null;
    }

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Скопировано!');
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
                Ответы сервера
            </Typography>
            {Object.entries(responses).map(([code, response]) => (
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
                                    onClick={() =>
                                        handleCopy(JSON.stringify(response.schema || response.content, null, 2))
                                    }
                                    sx={{ position: 'absolute', top: 5, right: 5 }}
                                >
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                </Paper>
            ))}
        </Box>
    );
}