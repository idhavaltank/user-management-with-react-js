import { Box, GlobalStyles } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import Iconify from '../components/iconify/Iconify';

const SnackbarStyles = () => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  return (
    <GlobalStyles
      styles={{
        '#root': {
          '& .SnackbarContent-root': {
            width: '100%',
            padding: theme.spacing(1),
            margin: theme.spacing(0.25, 0),
            // boxShadow: theme.customShadows.z,
            borderRadius: theme.shape.borderRadius,
            color: theme.palette.grey[isLight ? 0 : 800],
            backgroundColor: theme.palette.grey[isLight ? 900 : 0],
            '&.SnackbarItem-variantSuccess, &.SnackbarItem-variantError, &.SnackbarItem-variantWarning, &.SnackbarItem-variantInfo':
              {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.paper,
              },
            [theme.breakpoints.up('md')]: {
              minWidth: 240,
            },
          },
          '& .SnackbarItem-message': {
            padding: '0 !important',
            fontWeight: theme.typography.fontWeightMedium,
          },
          '& .SnackbarItem-action': {
            marginRight: 0,
            color: theme.palette.action.active,
            '& svg': { width: 20, height: 20 },
          },
        },
      }}
    />
  );
};

const NotistackProvider = ({ children }) => {
  const notistackRef = useRef(null);

  const onClose = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <>
      <SnackbarStyles />
      <SnackbarProvider
        ref={notistackRef}
        dense
        maxSnack={5}
        preventDuplicate
        autoHideDuration={3000}
        variant="success" // Set default variant
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        iconVariant={{
          info: <SnackbarIcon icon={'eva:info-fill'} color="info" />,
          success: <SnackbarIcon icon={'eva:checkmark-circle-2-fill'} color="success" />,
          warning: <SnackbarIcon icon={'eva:alert-triangle-fill'} color="warning" />,
          error: <SnackbarIcon icon={'eva:alert-circle-fill'} color="error" />,
        }}
        // With close as default
        action={(key) => <Iconify icon={'eva:close-fill'} onClick={onClose(key)} sx={{ cursor: 'pointer', mx: 1 }} />}
      >
        {children}
      </SnackbarProvider>
    </>
  );
};

const SnackbarIcon = ({ icon, color }) => (
  <Box
    component="span"
    sx={{
      mr: 1.5,
      width: 40,
      height: 40,
      display: 'flex',
      borderRadius: 1.5,
      alignItems: 'center',
      justifyContent: 'center',
      color: `${color}.main`,
      bgcolor: (theme) => alpha(theme.palette[color].main, 0.16),
    }}
  >
    <Iconify icon={icon} width={24} height={24} />
  </Box>
);

NotistackProvider.propTypes = {
  children: PropTypes.any,
};
SnackbarIcon.propTypes = {
  icon: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error']),
};

export default NotistackProvider;
