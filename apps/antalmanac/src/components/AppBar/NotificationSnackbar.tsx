import { PureComponent } from 'react';
import { ProviderContext, withSnackbar, OptionsObject } from 'notistack';
import { IconButton, Theme } from '@mui/material';
import { amber, green } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import { withStyles } from '@mui/styles';
import { ClassNameMap, Styles } from '@mui/styles/withStyles';
import AppStore from '$lib/stores/AppStore';

/**
 * style
 */
const styles: Styles<Theme, object> = (theme) => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.main,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
        opacity: 0.9,
    },
    iconVariant: {},
    message: {
        display: 'flex',
        alignItems: 'center',
    },
});

/**
 * snack snack
 */
export interface SnackbarPosition {
    horizontal: 'left' | 'right';
    vertical: 'bottom' | 'top';
}

/**
 */
interface NotificationSnackbarProps extends ProviderContext {
    classes: ClassNameMap;
}

/**
 * augmented snackbar options object (correctly) with a duration
 */
interface CustomOptionsObject extends OptionsObject {
    duration: any
}

/**
 * notification snack, yummy
 */
class NotificationSnackbar extends PureComponent<NotificationSnackbarProps> {
    state = {
        message: '',
        variant: 'info',
        duration: 3000,
    };

    openSnackbar() {
        this.props.enqueueSnackbar(AppStore.getSnackbarMessage(), {
            variant: AppStore.getSnackbarVariant(),
            duration: AppStore.getSnackbarDuration(),
            position: AppStore.getSnackbarPosition(),
            action: this.snackbarAction,
            style: AppStore.getSnackbarStyle(),
        } as CustomOptionsObject);
    };

    snackbarAction(key: string | number) {
        const { classes } = this.props;
        return (
            <IconButton
                key="close"
                color="inherit"
                onClick={() => {
                    this.props.closeSnackbar(key);
                }}
            >
                <CloseIcon className={classes.icon} />
            </IconButton>
        );
    };

    componentDidMount() {
        AppStore.on('openSnackbar', this.openSnackbar);
    };

    render() {
        return null;
    }
}


export default withSnackbar(withStyles(styles)(NotificationSnackbar));
