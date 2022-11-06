import { LoadingButton } from '@mui/lab';
import { Grid } from '@mui/material';
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
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
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
      .matches(/^([A-Za-z0-9]+\s?)*$/, 'Enter valid user name')
      .trim(),
    email: Yup.string().email('Must be a valid email').required('Email is required'),
    address: Yup.string().required('Address is required'),
    gender: Yup.string().required('gender is required'),
    birthDate: Yup.date()
      .typeError('please enter a valid date')
      .required()
      .min('1980-01-01', 'your birth year must be after 1980.')
      .max(formattedDate, 'kindly select past date.'),
    college: Yup.string()
      .matches(/^([A-Za-z0-9]+\s?)*$/, 'Enter valid college Name')
      .required('college is required'),
    hobbies: Yup.array().min(1).of(Yup.string().required()).required('Hobbies is required'),
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
    }),
    []
  );

  const methods = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(userSchema),
    defaultValues,
  });

  const { reset, handleSubmit, watch } = methods;
  const values = watch();

  useEffect(() => {
    reset(userId ? { ...currentUser } : { ...defaultValues });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const onSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCustomHobby(false);
      handleClose({ key: 'addEditModal' });
      setIsLoading(false);
      const userObject = {
        userId: userId || uuid(),
        name: values.name.trim(),
        email: values.email,
        address: values.address.trim(),
        hobbies: values.hobbies,
        college: values.college.trim(),
        gender: values.gender,
      };
      dispatch(addUpdateUser({ ...userObject }));
      enqueueSnackbar(`User ${!userId ? 'Created' : 'Updated'} Successfully`);
      reset(defaultValues);
    }, 1000);
  };

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
                disabled={'true'}
                sx={{ display: 'flex', flexDirection: 'column' }}
                options={['Reading', 'Gaming', 'Traveling', 'Drawing']}
              />
              <RHFMultiCheckbox onChange={(e) => setCustomHobby(e.target.checked)} name="hobbies" options={['other']} />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 1 }}>
              {customHobby && <RHFTextField name="customHobby" label="Custom hobby" />}
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
          <LoadingButton type="submit" variant="contained" name="submit" loading={isLoading}>
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
