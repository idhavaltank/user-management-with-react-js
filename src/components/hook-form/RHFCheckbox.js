import { Box, Checkbox, FormControlLabel, FormGroup, FormLabel } from '@mui/material';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';


RHFMultiCheckbox.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
};

export function RHFMultiCheckbox({ name, label, options, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const onSelected = (option) =>
          field.value.includes(option) ? field.value.filter((value) => value !== option) : [...field.value, option];
        return (
          <FormGroup {...other}>
            <FormLabel>{label}</FormLabel>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              {options.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={field.value.includes(option)}
                      onChange={() => field.onChange(onSelected(option))}
                    />
                  }
                  label={option}
                />
              ))}
            </Box>
          </FormGroup>
        );
      }}
    />
  );
}
