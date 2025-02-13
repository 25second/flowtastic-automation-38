
import { createBrowserRouter } from 'react-router-dom';
import { Index } from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import Settings from '@/pages/Settings';
import Tables from '@/pages/Tables';
import Servers from '@/pages/Servers';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { FlowLayout } from '@/components/flow/FlowLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: '/canvas',
    element: (
      <PrivateRoute>
        <FlowLayout
          nodes={[]}
          edges={[]}
          onNodesChange={() => {}}
          onEdgesChange={() => {}}
          onConnect={() => {}}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {}}
        >
          <div />
        </FlowLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <PrivateRoute>
        <Settings />
      </PrivateRoute>
    ),
  },
  {
    path: '/tables',
    element: (
      <PrivateRoute>
        <Tables />
      </PrivateRoute>
    ),
  },
  {
    path: '/servers',
    element: (
      <PrivateRoute>
        <Servers />
      </PrivateRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
