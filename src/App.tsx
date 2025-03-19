import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { Fragment, ElementType } from 'react';
import "./globals.css";

import { publicRoutes, privateRoutes } from './routes/routes';
import NotFound from './pages/Error';
import { AuthProvider } from './context/AuthContext';

const PrivateRoute = ({ element, path }: { element: JSX.Element, path: string}) => {
  const { token } = useSelector((state: RootState) => state.auth);

  return token ? element : <Navigate to="/sign-in" replace state={{ from: path }} />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let Layout: ElementType = Fragment;

                if (route.layout) {
                    Layout = route.layout;
                } else if (route.layout === null) {
                Layout = Fragment;
            }
            return <Route key={index} path={route.path} element={<Layout><Page /></Layout>} />;
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
                element={<PrivateRoute element={<Layout><Page /></Layout>} path={route.path} />} 
              />
            );
          })}
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
  </Router>
  );
}

export default App;