import moment from 'moment';
import { Card, CardActions, CardHeader, IconButton } from '@mui/material';
import { withStyles } from '@mui/styles';
import { ClassNameMap } from '@mui/styles/withStyles';
import { Delete } from '@mui/icons-material';
import { deleteCustomEvent } from '$lib/actions/AppStoreActions';
import analyticsEnum from '$lib/analytics';
import ColorPicker from '$components/ColorPicker';
import CustomEventDialog, { RepeatingCustomEvent } from '../../Calendar/Toolbar/CustomEventDialog/CustomEventDialog';

const styles = {
    root: {
        padding: '4px 4px 0px 8px',
    },
    colorPicker: {
        cursor: 'pointer',
        '& > div': {
            margin: '0px 8px 0px 4px',
            height: '20px',
            width: '20px',
            borderRadius: '50%',
        },
    },
};

interface CustomEventDetailViewProps {
    classes: ClassNameMap;
    customEvent: RepeatingCustomEvent;
    currentScheduleIndex: number;
    scheduleNames: string[];
}

const CustomEventDetailView = (props: CustomEventDetailViewProps) => {
    const { classes, customEvent } = props;

    const readableDateAndTimeFormat = (start: string, end: string, days: boolean[]) => {
        const startTime = moment({
            hours: parseInt(start.slice(0, 2)),
            minutes: parseInt(start.slice(3, 5)),
        });

        const endTime = moment({
            hours: parseInt(end.slice(0, 2)),
            minutes: parseInt(end.slice(3, 5)),
        });

        const dayAbbreviations = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const daysString = days.map((includeDate, index) => (includeDate ? dayAbbreviations[index] : '')).join(' ');

        return `${startTime.format('h:mm A')} — ${endTime.format('h:mm A')} • ${daysString}`;
    };

    return (
        <Card>
            <CardHeader
                titleTypographyProps={{ variant: 'subtitle1' }}
                className={classes.root}
                title={customEvent.title}
                subheader={readableDateAndTimeFormat(customEvent.start, customEvent.end, customEvent.days)}
            />
            <CardActions disableSpacing={true}>
                <div className={classes.colorPicker}>
                    <ColorPicker
                        color={customEvent.color as string}
                        isCustomEvent={true}
                        customEventID={customEvent.customEventID}
                        analyticsCategory={analyticsEnum.addedClasses.title}
                    />
                </div>
                <IconButton
                    onClick={() => {
                        deleteCustomEvent(customEvent.customEventID, props.currentScheduleIndex);
                    }}
                >
                    <Delete fontSize="small" />
                </IconButton>
                <CustomEventDialog
                    customEvent={customEvent}
                    scheduleNames={props.scheduleNames}
                    currentScheduleIndex={props.currentScheduleIndex}
                />
            </CardActions>
        </Card>
    );
};

export default withStyles(styles)(CustomEventDetailView);
