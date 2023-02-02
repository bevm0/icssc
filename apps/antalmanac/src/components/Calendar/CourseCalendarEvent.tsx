import { IconButton, Paper, Tooltip, Box } from '@mui/material';
import { withStyles } from '@mui/styles';
import { ClassNameMap } from '@mui/material/styles';
import { Delete } from '@mui/icons-material';
import { Event } from 'react-big-calendar';
import { deleteCourse, deleteCustomEvent } from '$lib/actions/AppStoreActions';
import analyticsEnum, { logAnalytics } from '$lib/analytics';
import { clickToCopy } from '$lib/helpers';
import AppStore from '$lib/stores/AppStore';
import ColorPicker from '$components/ColorPicker';
import CustomEventDialog from './Toolbar/CustomEventDialog/CustomEventDialog';
import locations from '../RightPane/SectionTable/static/locations.json';

const styles = {
    courseContainer: {
        padding: '0.5rem',
        minWidth: '15rem',
    },
    customEventContainer: {
        padding: '0.5rem',
    },
    buttonBar: {
        display: 'flex',
        alignItems: 'center',
    },
    title: {
        fontSize: '0.9rem' as const,
        fontWeight: 500,
    },
    icon: {
        cursor: 'pointer',
    },
    titleBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    table: {
        border: 'none',
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.9rem',
    },
    alignToTop: {
        verticalAlign: 'top',
    },
    rightCells: {
        textAlign: 'right',
    },
    multiline: {
        whiteSpace: 'pre',
    },
    stickToRight: {
        float: 'right',
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
} as const

const genMapLink = (location: string) => {
    try {
        const location_id = locations[location.split(' ')[0] as keyof typeof locations];
        return 'https://map.uci.edu/?id=463#!m/' + location_id;
    } catch (err) {
        return 'https://map.uci.edu/';
    }
};

interface CommonCalendarEvent extends Event {
    color: string;
    start: Date;
    end: Date;
    scheduleIndices: number[];
    title: string;
}

export interface CourseEvent extends CommonCalendarEvent {
    bldg: string;
    finalExam: string;
    instructors: string[];
    isCustomEvent: boolean;
    sectionCode: string;
    sectionType: string;
    term: string;
}

/**
 * There is another CustomEvent interface in CourseCalendarEvent and they are slightly different.  The this one represents only one day, like the event on Monday, and needs to be duplicated to be repeated across multiple days. The other one, `CustomEventDialog`'s `RepeatingCustomEvent`, encapsulates the occurences of an event on multiple days, like Monday Tuesday Wednesday all in the same object as specified by the `days` array.
 * https://github.com/icssc/AntAlmanac/wiki/The-Great-AntAlmanac-TypeScript-Rewritening%E2%84%A2#duplicate-interface-names-%EF%B8%8F
 */
export interface CustomEvent extends CommonCalendarEvent {
    customEventID: number;
    isCustomEvent: true;
}

export type CalendarEvent = CourseEvent | CustomEvent;

interface CourseCalendarEventProps {
    classes: ClassNameMap;
    courseInMoreInfo: CalendarEvent;
    currentScheduleIndex: number;
    scheduleNames: string[];
    closePopover: () => void;
}

const CourseCalendarEvent = (props: CourseCalendarEventProps) => {
    const { classes, courseInMoreInfo, currentScheduleIndex } = props;
    if (!courseInMoreInfo.isCustomEvent) {
        const { term, instructors, sectionCode, title, finalExam, bldg } = courseInMoreInfo;

        return (
            <Paper sx={{ padding: '0.5rem', minWidth: '15rem' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{title}</span>
                    <Tooltip title="Delete">
                        <IconButton
                            size="small"
                            onClick={() => {
                                deleteCourse(sectionCode, currentScheduleIndex, term);
                                logAnalytics({
                                    category: analyticsEnum.calendar.title,
                                    action: analyticsEnum.calendar.actions.DELETE_COURSE,
                                });
                            }}
                        >
                            <Delete fontSize="inherit" />
                        </IconButton>
                    </Tooltip>
                </Box>
                <table className={classes.table}>
                    <tbody>
                        <tr>
                            <td className={classes.alignToTop}>Section code</td>
                            <Tooltip title="Click to copy course code" placement="right">
                                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                                <td
                                    onClick={(e) => {
                                        logAnalytics({
                                            category: analyticsEnum.calendar.title,
                                            action: analyticsEnum.calendar.actions.COPY_COURSE_CODE,
                                        });
                                        clickToCopy(e, sectionCode);
                                    }}
                                    className={classes.rightCells}
                                >
                                    <u>{sectionCode}</u>
                                </td>
                            </Tooltip>
                        </tr>
                        <tr>
                            <td className={classes.alignToTop}>Term</td>
                            <td className={classes.rightCells}>{term}</td>
                        </tr>
                        <tr>
                            <td className={classes.alignToTop}>Instructors</td>
                            <td className={`${classes.multiline} ${classes.rightCells}`}>{instructors.join('\n')}</td>
                        </tr>
                        <tr>
                            <td className={classes.alignToTop}>Location</td>
                            <td className={`${classes.multiline} ${classes.rightCells}`}>
                                {bldg !== 'TBA' ? (
                                    <a href={genMapLink(bldg)} target="_blank" rel="noopener noreferrer">
                                        {bldg}
                                    </a>
                                ) : (
                                    bldg
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>Final</td>
                            <td className={classes.rightCells}>{finalExam}</td>
                        </tr>
                        <tr>
                            <td>Color</td>
                            <td className={`${classes.colorPicker} ${classes.stickToRight}`}>
                                <ColorPicker
                                    color={courseInMoreInfo.color}
                                    isCustomEvent={courseInMoreInfo.isCustomEvent}
                                    sectionCode={courseInMoreInfo.sectionCode}
                                    term={courseInMoreInfo.term}
                                    analyticsCategory={analyticsEnum.calendar.title}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Paper>
        );
    } else {
        const { title } = courseInMoreInfo;

        // the weird union means that customEventID might not exist; default to some random number
        const customEventID = 'customEventID' in courseInMoreInfo ? courseInMoreInfo.customEventID : 69420

        return (
            <Paper sx={{ padding: '0.5rem' }} onClick={(event) => event.stopPropagation()}>
                <div className={classes.title}>{title}</div>
                <div className={classes.buttonBar}>
                    <div className={`${classes.colorPicker}`}>
                        <ColorPicker
                            color={courseInMoreInfo.color}
                            isCustomEvent={true}
                            customEventID={customEventID}
                            analyticsCategory={analyticsEnum.calendar.title}
                        />
                    </div>
                    <CustomEventDialog
                        onDialogClose={props.closePopover}
                        customEvent={AppStore.getCustomEvents().find(
                            (customEvent) => customEvent.customEventID === customEventID
                        )}
                        scheduleNames={props.scheduleNames}
                        currentScheduleIndex={currentScheduleIndex}
                    />

                    <Tooltip title="Delete">
                        <IconButton
                            onClick={() => {
                                props.closePopover();
                                deleteCustomEvent(customEventID, currentScheduleIndex);
                                logAnalytics({
                                    category: analyticsEnum.calendar.title,
                                    action: analyticsEnum.calendar.actions.DELETE_CUSTOM_EVENT,
                                });
                            }}
                        >
                            <Delete fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </div>
            </Paper>
        );
    }
};

export default withStyles(styles)(CourseCalendarEvent);
