import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: 'rgb(102, 157, 246)' },
        background: { default: 'rgb(10, 25, 41)', paper: 'rgb(5, 30, 52)' },
        text: {
            primary: '#fff',
            terziary: 'rgba(71, 98, 130, 0.2)'
        },
    },
});

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: 'rgb(25, 118, 210)' },
        background: { default: '#eaeff1', paper: '#f5f5f5' },
        text: {
            primary: '#222',
            secondary: 'rgba(0, 0, 0, 0.7)',
            terziary: 'rgba(219, 218, 218, 0.7)'
        },
    },
});