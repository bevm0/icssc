import { Collapse, Grid, Paper, Theme,Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import { ClassNameMap , Styles } from '@mui/styles/withStyles';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { PureComponent } from 'react';

/**
 * the theme object doesn't have mixins.gutters ?
 */
interface CustomTheme extends Theme {
    mixins: Theme['mixins'] & {
        gutters: any
    }
}

const styles: Styles<CustomTheme, object> = (theme) => ({
    school: {
        display: 'flex',
        flexWrap: 'wrap',
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing(),
        paddingBottom: theme.spacing(),
    },
    dept: {
        display: 'flex',
        flexWrap: 'wrap',
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing(),
        paddingBottom: theme.spacing(),
    },
    text: {
        flexBasis: '50%',
        flexGrow: 1,
        display: 'inline',
    },
    icon: {
        cursor: 'pointer',
    },
    collapse: {
        flexBasis: '100%',
    },
    comments: {
        fontFamily: 'Roboto',
        fontSize: 12,
    },
});

interface SchoolDeptCardProps {
    classes: ClassNameMap;
    comment: string;
    name: string;
    type: string;
}

class SchoolDeptCard extends PureComponent<SchoolDeptCardProps> {
    state = { commentsOpen: false };

    render() {
        const html = { __html: this.props.comment };
        const ExpandIcon = this.state.commentsOpen ? ExpandLess : ExpandMore;
        return (
            <Grid item xs={12}>
                <Paper className={this.props.classes[this.props.type]} elevation={1} square>
                    <Typography
                        noWrap
                        variant={this.props.type === 'school' ? 'h6' : 'subtitle1'}
                        className={this.props.classes.text}
                    >
                        {this.props.name}
                    </Typography>
                    <>
                        <ExpandIcon
                            onClick={() =>
                                this.setState({
                                    commentsOpen: !this.state.commentsOpen,
                                })
                            }
                            className={this.props.classes.icon}
                        />

                        <Collapse in={this.state.commentsOpen} className={this.props.classes.collapse}>
                            <Typography variant="body2">
                                {this.props.comment === '' ? 'No comments found' : 'Comments:'}
                            </Typography>
                            <div dangerouslySetInnerHTML={html} className={this.props.classes.comments} />
                        </Collapse>
                    </>
                </Paper>
            </Grid>
        );
    }
}

export default withStyles(styles)(SchoolDeptCard);
