'use client';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { themeStore } from '../stores/themeStore';

export default observer(function ThemeToggle() {
  return (
    <IconButton onClick={() => themeStore.toggleTheme()} color="inherit">
      {themeStore.darkMode ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
});