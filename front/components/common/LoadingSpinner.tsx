import { CircularProgress, Box, Typography } from '@mui/material';

interface LoadingSpinnerProps {
    message?: string;
}

export function LoadingSpinner({ message = 'Загрузка...' }: LoadingSpinnerProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
            }}
        >
            <CircularProgress />
            <Typography sx={{ mt: 2 }} color="text.secondary">
                {message}
            </Typography>
        </Box>
    );
}