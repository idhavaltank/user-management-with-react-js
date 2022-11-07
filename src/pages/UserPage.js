import {
  Button,
  Card,
  Container,
  IconButton,
  MenuItem,
  Paper,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Iconify from '../components/iconify/Iconify';
import Scrollbar from '../components/scrollbar';
import AddEditUserModal from '../modals/AddEditUserModal';
import ConfirmationModal from '../modals/ConfirmationModal';
import { removeUser } from '../redux/actions/userAction';
import UserListHead from '../sections/user/UserListHead';
import UserListToolbar from '../sections/user/UserListToolbar';
import { applySortFilter, getComparator } from '../utils/sortData';
import TABLE_HEAD from '../utils/TABLE_HEAD';

const UserPage = () => {
  // local state for use maintain functionality.
  const [opens, setOpens] = useState({
    actionMenu: null,
    addEditModal: false,
    confirmationModal: false,
  });
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selectedUser, setSelectedUser] = useState({});
  const [orderBy, setOrderBy] = useState('');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userList, setUserList] = useState([]);
  const dispatch = useDispatch();

  // fetch user data from redux
  const users = useSelector((state) => state?.user?.list);

  // maintain modal and action menu for open and close
  // ------------------- START -------------------------
  const handleOpen = (props) => {
    const key = props?.key;
    if (props.event || props.status) {
      setOpens({ ...opens, [key]: props.status || props.event.currentTarget });
    }
    if (props.data) {
      setSelectedUser({ ...props?.data });
    }
  };

  const handleClose = ({ key, status }) => {
    setOpens({ ...opens, [key]: status || false });
  };
  // -------------------- END --------------------------

  // This function for sorting data
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // This function  display users based on page.
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // This function set number of users at one page.
  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  // Filter users based on searchQuery.
  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  // This function is used for remove user from localStorage and redux.
  const removedUser = () => {
    handleClose({ key: 'actionMenu', status: null });
    handleClose({ key: 'confirmationModal' });
    dispatch(removeUser(selectedUser?.userId));
  };

  // This useEffect update user list while trigger dispatch and users.
  useEffect(() => {
    setUserList([...users]);
  }, [dispatch, users]);

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Mind Bowser User Management</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => handleOpen({ key: 'addEditModal', status: true })}
          >
            New User
          </Button>
        </Stack>

        <Card>
          <UserListToolbar filterName={filterName} onFilterName={handleFilterByName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 400 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow hover key={row?.userId} tabIndex={-1} role="checkbox">
                      <TableCell component="th" scope="row">
                        {row?.name || '-'}
                      </TableCell>

                      <TableCell align="left">{row?.email || '-'}</TableCell>
                      <TableCell align="left">{row?.gender || '-'}</TableCell>
                      <TableCell align="left">
                        {(row?.birthDate && new Date(row?.birthDate).toLocaleDateString('en-IN')) || '-'}
                      </TableCell>
                      <TableCell align="left">{row?.college || '-'}</TableCell>
                      <TableCell align="left">{row?.address || '-'}</TableCell>
                      <TableCell align="left">
                        {(row?.isCustomHobby
                          ? row?.hobbies.toString().concat(',', row?.customHobbies)
                          : row?.hobbies.toString()) || '-'}
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          size="large"
                          color="inherit"
                          onClick={(event) => handleOpen({ key: 'actionMenu', event, data: row })}
                        >
                          <Iconify icon={'eva:more-vertical-fill'} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={TABLE_HEAD.length + 1} sx={{ py: 5 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                            boxShadow: 'none',
                          }}
                        >
                          <Typography gutterBottom align="center" variant="h4">
                            Not found
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={userList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(opens?.actionMenu)}
        anchorEl={opens?.actionMenu}
        onClose={() => handleClose({ key: 'actionMenu', status: null })}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose({ key: 'actionMenu', status: null });
            handleOpen({ key: 'addEditModal', status: true });
          }}
        >
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          onClick={() => {
            handleClose({ key: 'actionMenu', status: null });
            handleOpen({ key: 'confirmationModal', status: true });
          }}
        >
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      <AddEditUserModal currentUser={selectedUser} open={opens?.addEditModal} handleClose={handleClose} />
      <ConfirmationModal open={opens?.confirmationModal} handleClose={handleClose} handleConfirm={removedUser} />
    </>
  );
};
export default UserPage;
