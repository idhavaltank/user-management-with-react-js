import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard/DashboardLayout';

import UserPage from './pages/UserPage';

const Router = () => useRoutes([
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/user" />, index: true },
        { path: 'user', element: <UserPage /> },
      ],
    },
  ]);

export default Router;
