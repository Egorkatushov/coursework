import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Chip,
    Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SwaggerParameters } from './SwaggerParameters';
import { SwaggerResponses } from './SwaggerResponses';
import { getMethodColor } from '@/utils/parsers/swaggerParser';
import type { SwaggerEndpoint as SwaggerEndpointType } from '@/types';

interface SwaggerEndpointProps {
    path: string;
    method: string;
    endpoint: SwaggerEndpointType;
}

const METHOD_NAMES: Record<string, string> = {
    get: 'GET',
    post: 'POST',
    put: 'PUT',
    delete: 'DELETE',
    patch: 'PATCH',
    head: 'HEAD',
    options: 'OPTIONS',
};

export function SwaggerEndpoint({ path, method, endpoint }: SwaggerEndpointProps) {
    const methodLower = method.toLowerCase();
    const methodName = METHOD_NAMES[methodLower] || method.toUpperCase();
    const methodColor = getMethodColor(method);

    return (
        <Accordion sx={{ mb: 1 }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                    '&:hover': {
                        backgroundColor: 'action.hover',
                    },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', width: '100%' }}>
                    <Chip
                        label={methodName}
                        color={methodColor}
                        size="small"
                        sx={{
                            fontWeight: 'bold',
                            minWidth: 70,
                            fontFamily: 'monospace',
                        }}
                    />
                    <Typography
                        sx={{
                            fontFamily: 'monospace',
                            wordBreak: 'break-all',
                            fontWeight: 500,
                        }}
                    >
                        {path}
                    </Typography>
                    {endpoint.deprecated && (
                        <Chip
                            label="Deprecated"
                            color="error"
                            size="small"
                            variant="outlined"
                            sx={{ ml: 'auto' }}
                        />
                    )}
                </Box>
            </AccordionSummary>

            <AccordionDetails>
                {/* Краткое описание */}
                {endpoint.summary && (
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        {endpoint.summary}
                    </Typography>
                )}

                {/* Полное описание */}
                {endpoint.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {endpoint.description}
                    </Typography>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Параметры запроса */}
                <SwaggerParameters parameters={endpoint.parameters || []} />

                {/* Ответы сервера */}
                <SwaggerResponses responses={endpoint.responses || {}} />

                {/* Дополнительная информация */}
                {endpoint.operationId && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                        Operation ID: {endpoint.operationId}
                    </Typography>
                )}
            </AccordionDetails>
        </Accordion>
    );
}