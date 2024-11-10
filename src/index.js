import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter} from 'react-router-dom';
import Home from '@/views/Home';
import Detail from '@/views/Detail';
import ErrorBound from '@/components/ErrorBound';
import NotFound from '@/components/NotFound';
import './index.css';

const routes = [
  {
    path: '/',
    element: <ErrorBound><Home/></ErrorBound>,
  },
  {
    path: '/detail/:key',
    element: <ErrorBound><Detail /></ErrorBound>,
  },
  {
    path: "*",
    element: <NotFound />
  }
];
const router = createBrowserRouter(routes);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router}/>);
