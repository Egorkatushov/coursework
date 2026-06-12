'use client';

import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { observer } from 'mobx-react-lite';
import { themeStore } from '@/stores/themeStore';

export const ThemeProvider = observer(({ children }: { children: React.ReactNode }) => {
    const theme = createTheme({
        palette: {
            mode: themeStore.darkMode ? 'dark' : 'light',
        },
    });

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    );
});