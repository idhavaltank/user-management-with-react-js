import { LoadingButton } from '@mui/lab';
import { Alert, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';

import { useSnackbar } from 'notistack';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { FormProvider, RHFMultiCheckbox, RHFRadioGroup, RHFTextField } from '../components/hook-form';
import { addUpdateUser } from '../redux/actions/userAction';

import uuid from '../utils/uuid';

const GENDER_OPTION = ['Men', 'Women'];

const AddEditUserModal = (props) => {
  const { open, handleClose, currentUser } = props;
  const userId = currentUser?.userId || '';
  // local state
  const [isLoading, setIsLoading] = useState(false);
  const [customHobby, setCustomHobby] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // hooks
  const dispatch = useDispatch();

  // user form validation using yup
  const userSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .matches(/^([A-Za-z0-9]+\s?)*$/, 'Enter valid name.')
      .trim(),
    email: Yup.string().required('Email is required').email('Must be a valid email'),
    address: Yup.string()
      .required('Address is required')
      .matches(/^([A-Za-z0-9]+\s?)*$/, 'Enter valid address.'),
    gender: Yup.string().required('Gender is required'),
    birthDate: Yup.date()
      .typeError('Please enter a valid date')
      .required()
      .min('1960-01-01', 'Your birth year must be after 01-01-1960.')
      .max('2000-01-01', 'Your birth year must be before 01-01-2000.'),
    college: Yup.string()
      .required('College is required')
      .matches(/^([A-Za-z0-9]+\s?)*$/, 'Enter valid college Name'),
    customHobbies: Yup.string().when('isCustomHobby', {
      is: (isCustomHobby) => isCustomHobby,
      then: Yup.string().required('Custom hobby is required,  otherwise unchecked "Other" from hobbies.'),
    }),
  });

  // form default values
  const defaultValues = useMemo(
    () => ({
      name: '',
      birthDate: '',
      address: '',
      gender: '',
      email: '',
      college: '',
      hobbies: '',
      customHobbies: '',
      isCustomHobby: '',
    }),
    []
  );

  const methods = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(userSchema),
    defaultValues,
  });

  const {
    reset,
    resetField,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;
  const values = watch();

  const onSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCustomHobby(false);
      handleClose({ key: 'addEditModal' });
      setIsLoading(false);
      const userObject = {
        ...values,
        userId: userId || uuid(),
        name: values.name.trim(),
        address: values.address.trim(),
        customHobbies: values.customHobbies.trim(),
        college: values.college.trim(),
      };
      dispatch(addUpdateUser({ ...userObject }));
      enqueueSnackbar(`User ${!userId ? 'Created' : 'Updated'} Successfully`);
      reset(defaultValues);
    }, 1000);
  };

  // Update form values based on userId
  useEffect(() => {
    reset(userId ? { ...currentUser } : { ...defaultValues });
    if (currentUser.isCustomHobby) {
      setCustomHobby(currentUser.isCustomHobby);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <Dialog fullWidth open={open} onClose={() => handleClose({ key: 'addEditModal' })}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{!userId ? 'Add User' : 'Update User'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={1} sx={{ height: '500px', maxHeight: '500px', overflow: 'auto' }}>
            <Grid item xs={12} sm={6} sx={{ marginTop: 1 }}>
              <RHFTextField name="name" label="Full Name" />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ marginTop: 1 }}>
              <RHFTextField name="email" label="Email Address" />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 1 }}>
              <RHFTextField name="address" label="Address" />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 1 }}>
              <RHFTextField name="college" label="College Name" />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 1 }}>
              <RHFTextField
                name="birthDate"
                label="Birth Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                sx={{ cursor: 'pointer' }}
              />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 1, display: 'flex', alignItems: 'flex-end' }}>
              <RHFMultiCheckbox
                name="hobbies"
                label="Hobbies"
                sx={{ display: 'flex', flexDirection: 'column' }}
                options={['Reading', 'Gaming', 'Traveling', 'Drawing']}
              />
              <RHFMultiCheckbox
                onChange={(e) => {
                  setCustomHobby(e.target.checked);
                  if (!e.target.checked) resetField('customHobbies');
                }}
                name="isCustomHobby"
                options={['other']}
              />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 1 }}>
              {customHobby && (
                <>
                  <Alert variant="outlined" severity="info" sx={{ fontSize: '12px', my: 1, py: 0 }}>
                    Please add multiple hobbies with ","(comma). | Like: hobby1,hobby2
                  </Alert>
                  <RHFTextField name="customHobbies" label="Custom hobby" />
                </>
              )}
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 1 }}>
              <RHFRadioGroup name="gender" label="Gender" options={GENDER_OPTION} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            name="reset"
            type="reset"
            variant="outlined"
            disabled={isLoading}
            onClick={() => {
              setCustomHobby(false);
              handleClose({ key: 'addEditModal' });
              reset(defaultValues);
            }}
          >
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" name="submit" loading={isLoading || isSubmitting}>
            {!userId ? 'Create' : 'Save'}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

AddEditUserModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  currentUser: PropTypes.object,
};
export default AddEditUserModal;
