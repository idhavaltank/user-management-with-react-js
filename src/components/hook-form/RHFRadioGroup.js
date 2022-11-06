import { Box, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/material';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

RHFRadioGroup.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  getOptionLabel: PropTypes.arrayOf(PropTypes.string),
};

export default function RHFRadioGroup({ name, label, options, getOptionLabel, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box>
          <RadioGroup {...field} {...other}>
            <FormLabel>{label}</FormLabel>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              {options.map((option, index) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={getOptionLabel?.length ? getOptionLabel[index] : option}
                />
              ))}
            </Box>
          </RadioGroup>

          {!!error && (
            <FormHelperText error sx={{ px: 2 }}>
              {error.message}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
}
