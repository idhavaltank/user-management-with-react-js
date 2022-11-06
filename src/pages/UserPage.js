import {
  Button,
  Card,
  Checkbox,
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
  Typography,
} from '@mui/material';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Iconify from '../components/iconify/Iconify';
import Scrollbar from '../components/scrollbar';
import AddEditUserModal from '../modals/AddEditUserModal';
import ConfirmationModal from '../modals/ConfirmationModal';
import { removeUser } from '../redux/actions/userAction';
import { UserListHead, UserListToolbar } from '../sections/user';
import TABLE_HEAD from '../utils/TABLE_HEAD';

const descendingComparator = (a, b, orderBy) => (b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0);

const getComparator = (order, orderBy) => (a, b) =>
  order === 'desc' ? descendingComparator(a, b, orderBy) : -descendingComparator(a, b, orderBy);

const applySortFilter = (array, comparator, query) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
};

export default function UserPage() {
  const [opens, setOpens] = useState({
    actionMenu: null,
    addEditModal: false,
    confirmationModal: false,
  });
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [orderBy, setOrderBy] = useState('birthDate');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userList, setUserList] = useState([]);
  const dispatch = useDispatch();

  const users = useSelector((state) => state?.user?.list);

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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected([...userList.map((user) => user.userId)]);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, userId) => {
    const selectedIndex = selected.indexOf(userId);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, userId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleConfirm = () => {
    handleClose({ key: 'actionMenu', status: null });
    handleClose({ key: 'confirmationModal' });
    dispatch(removeUser(selectedUser?.userId));
  };

  const removedSelected = () => {
    selected.forEach((element) => {
      dispatch(removeUser(element));
    });
  };

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
          <UserListToolbar
            numSelected={selected.length}
            removedSelected={removedSelected}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 400 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={userList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const selectedUser = selected.indexOf(row?.userId) !== -1;

                    return (
                      <TableRow hover key={row?.userId} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, row?.userId)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          {row?.name || '-'}
                        </TableCell>

                        <TableCell align="left">{row?.email || '-'}</TableCell>
                        <TableCell align="left">{row?.gender || '-'}</TableCell>
                        <TableCell align="left">{row?.birthDate || '-'}</TableCell>
                        <TableCell align="left">{row?.college || '-'}</TableCell>
                        <TableCell align="left">{row?.address || '-'}</TableCell>
                        <TableCell align="left">{row?.hobbies.toString() || '-'}</TableCell>

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
                    );
                  })}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={TABLE_HEAD.length} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
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
      <ConfirmationModal open={opens?.confirmationModal} handleClose={handleClose} handleConfirm={handleConfirm} />
    </>
  );
}
