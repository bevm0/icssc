import { IconButton, Menu, MenuItem, TableCell, useMediaQuery } from '@mui/material';
import { withStyles } from '@mui/styles';
import { ClassNameMap } from '@mui/styles/withStyles';
import { Add, ArrowDropDown,Delete } from '@mui/icons-material';
import { bindMenu, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks';
import { addCourse, deleteCourse, openSnackbar } from '$lib/actions/AppStoreActions';
import analyticsEnum, { logAnalytics } from '$lib/analytics';
import { CourseDetails } from '$lib/helpers';
import { AASection } from '$types/peterportal.types';
import AppStore from '$lib/stores/AppStore';
import ColorPicker from '$components/ColorPicker';

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'space-evenly',
    },
};

interface ColorAndDeleteProps {
    sectionCode: string;
    color: string;
    classes: ClassNameMap;
    term: string;
}

export const ColorAndDelete = withStyles(styles)((props: ColorAndDeleteProps) => {
    const { sectionCode, color, classes, term } = props;
    const isMobileScreen = useMediaQuery('(max-width: 750px)');

    return (
        <TableCell padding="none">
            <div className={classes.container} style={isMobileScreen ? { flexDirection: 'column' } : {}}>
                <IconButton
                    onClick={() => {
                        deleteCourse(sectionCode, AppStore.getCurrentScheduleIndex(), term);
                        logAnalytics({
                            category: analyticsEnum.addedClasses.title,
                            action: analyticsEnum.addedClasses.actions.DELETE_COURSE,
                        });
                    }}
                >
                    <Delete fontSize="small" />
                </IconButton>
                <ColorPicker
                    color={color}
                    isCustomEvent={false}
                    sectionCode={sectionCode}
                    term={term}
                    analyticsCategory={analyticsEnum.addedClasses.title}
                />
            </div>
        </TableCell>
    );
});

interface ScheduleAddCellProps {
    classes: ClassNameMap;
    section: AASection;
    courseDetails: CourseDetails;
    term: string;
    scheduleNames: string[];
}

export const ScheduleAddCell = withStyles(styles)((props: ScheduleAddCellProps) => {
    const { classes, section, courseDetails, term, scheduleNames } = props;
    const popupState = usePopupState({ popupId: 'SectionTableAddCellPopup', variant: 'popover' });
    const isMobileScreen = useMediaQuery('(max-width: 750px)');

    const closeAndAddCourse = (scheduleIndex: number, specificSchedule?: boolean) => {
        popupState.close();
        for (const meeting of section.meetings) {
            if (meeting.time === 'TBA') {
                openSnackbar('success', 'Online/TBA class added');
                // See Added Classes."
                break;
            }
        }

        if (scheduleIndex !== -1) {
            if (specificSchedule) {
                logAnalytics({
                    category: analyticsEnum.classSearch.title,
                    action: analyticsEnum.classSearch.actions.ADD_SPECIFIC,
                });
            }
            section.color = addCourse(section, courseDetails, term, scheduleIndex);
        }
    };

    return (
        <TableCell padding="none">
            <div className={classes.container} style={isMobileScreen ? { flexDirection: 'column' } : {}}>
                <IconButton onClick={() => closeAndAddCourse(AppStore.getCurrentScheduleIndex())}>
                    <Add fontSize="small" />
                </IconButton>
                <IconButton {...bindTrigger(popupState)}>
                    <ArrowDropDown fontSize="small" />
                </IconButton>
                <Menu {...bindMenu(popupState)} onClose={() => closeAndAddCourse(-1)}>
                    {scheduleNames.map((name, index) => (
                        <MenuItem key={index} onClick={() => closeAndAddCourse(index, true)}>
                            Add to {name}
                        </MenuItem>
                    ))}
                    <MenuItem onClick={() => closeAndAddCourse(scheduleNames.length, true)}>
                        Add to All Schedules
                    </MenuItem>
                </Menu>
            </div>
        </TableCell>
    );
});
