import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { getUser } from './redux/actions/userAction';
import Router from './routes';
import ThemeProvider from './theme';
import { createStorage } from './utils/localStorage';

const App = () => {
  const dispatch = useDispatch();

  // Create LocalStorage and get data from local Storage and store in redux.
  useEffect(() => {
    createStorage('userList');
    dispatch(getUser());
  }, [dispatch]);

  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
};

export default App;
