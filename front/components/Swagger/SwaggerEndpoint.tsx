// components/Swagger/SwaggerEndpoint.tsx

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
import { getMethodColor } from '../../utils/parsers/swaggerParser';
import type { SwaggerEndpoint as SwaggerEndpointType } from '../../types';

interface SwaggerEndpointProps {
    path: string;
    method: string;
    endpoint: SwaggerEndpointType;
}

export function SwaggerEndpoint({ path, method, endpoint }: SwaggerEndpointProps) {
    return (
        <Accordion sx={{ mb: 1 }}>
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
                    {endpoint.deprecated && (
                        <Chip label="Deprecated" color="error" size="small" variant="outlined" />
                    )}
                </Box>
            </AccordionSummary>

            <AccordionDetails>
                {endpoint.summary && (
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        {endpoint.summary}
                    </Typography>
                )}
                {endpoint.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {endpoint.description}
                    </Typography>
                )}

                <Divider sx={{ my: 2 }} />

                <SwaggerParameters parameters={endpoint.parameters || []} />
                <SwaggerResponses responses={endpoint.responses || {}} />
            </AccordionDetails>
        </Accordion>
    );
}