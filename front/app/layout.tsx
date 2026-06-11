'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react-lite';
import { themeStore } from '../stores/themeStore';
import ThemeToggle from '../components/ThemeToggle';
import Link from 'next/link';
import SeoHead from '../components/SeoHead';
import './globals.css';

export default observer(function RootLayout({
                                                children,
                                            }: {
    children: React.ReactNode;
}) {
    const theme = createTheme({
        palette: {
            mode: themeStore.darkMode ? 'dark' : 'light',
        },
    });

    return (
        <html lang="ru">
        <SeoHead />
        <body>
        <ThemeProvider theme={theme}>
            <CssBaseline />
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
            <Container sx={{ py: 4 }}>
                {children}
            </Container>
        </ThemeProvider>
        </body>
        </html>
    );
});