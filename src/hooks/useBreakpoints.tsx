import { useMediaQuery, useTheme } from '@mui/material';

export const useBreakpoints = () => {
  const theme = useTheme();

  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.only('xl'));
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isLgDown = useMediaQuery(theme.breakpoints.down('lg'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const isXlDown = useMediaQuery(theme.breakpoints.down('xl'));
  const isXlUp = useMediaQuery(theme.breakpoints.up('xl'));

  return {
    isMd,
    isSm,
    isXs,
    isLg,
    isXl,
    isSmDown,
    isSmUp,
    isMdDown,
    isMdUp,
    isLgDown,
    isLgUp,
    isXlDown,
    isXlUp,
    breakpoints: theme.breakpoints.values,
  };
};
