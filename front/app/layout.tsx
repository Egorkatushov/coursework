// app/layout.tsx
import { Metadata } from 'next';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import Link from 'next/link';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import './globals.css';

export const metadata: Metadata = {
    title: {
        default: 'EduSwagger - Визуализатор Swagger и SQL',
        template: '%s | EduSwagger',
    },
    description: 'Веб-приложение для визуализации Swagger/OpenAPI спецификаций и SQL схем',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru">
        <body>
        <ThemeProvider>
            {/* Навигация */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
                            EduSwagger
                        </Link>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
                        <Link href="/swagger" style={{ color: 'white', textDecoration: 'none' }}>
                            Swagger
                        </Link>
                        <Link href="/sql" style={{ color: 'white', textDecoration: 'none' }}>
                            SQL
                        </Link>
                    </Box>
                    <ThemeToggle />
                </Toolbar>
            </AppBar>
            <Container sx={{ py: 4 }}>{children}</Container>
        </ThemeProvider>
        </body>
        </html>
    );
}