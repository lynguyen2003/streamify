import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { RootState, store } from './store';
import { Fragment, ElementType } from 'react';
import "./globals.css";

import { publicRoutes, privateRoutes } from './routes/routes';
import NotFound from './pages/Error';

// Add PrivateRoute component
const PrivateRoute = ({ element, path }: { element: JSX.Element, path: string}) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return element;
};

function App() {
  return (
    <Provider store={store}>
        <Router>
          <Routes>
          {publicRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout: ElementType = Fragment;

                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }

                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })}
                {privateRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout: ElementType = Fragment;

                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <PrivateRoute
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                    path={route.path}
                                />
                            }
                        />
                    );
                })}
                
                <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
    </Provider>
  );
}

export default App;