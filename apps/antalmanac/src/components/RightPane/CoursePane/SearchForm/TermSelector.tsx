import { PureComponent } from 'react';
import { MenuItem, InputLabel, FormControl, Select } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { termData } from '$lib/termData';
import RightPaneStore from '../../RightPaneStore';

interface TermSelectorProps {
    changeState: (field: string, value: string) => void;
    fieldName: string;
}

class TermSelector extends PureComponent<TermSelectorProps> {
    state = {
        term: RightPaneStore.getFormData().term,
    };

    resetField = () => {
        this.setState({ term: RightPaneStore.getFormData().term });
    };

    componentDidMount = () => {
        RightPaneStore.on('formReset', this.resetField);
    };

    componentWillUnmount() {
        RightPaneStore.removeListener('formReset', this.resetField);
    }

    // strongly typed Event used to be with generic:
    // { name?: string | undefined; value: unknown }
    handleChange = (event: SelectChangeEvent<any>) => {
        this.setState({ term: event.target.value });
        this.props.changeState(this.props.fieldName, event.target.value as string);
    };

    render() {
        return (
            <FormControl fullWidth>
                <InputLabel>Term</InputLabel>
                <Select value={this.state.term} onChange={this.handleChange}>
                    {termData.map((term, index) => (
                        <MenuItem key={index} value={term.shortName}>
                            {term.longName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }
}

export default TermSelector;
