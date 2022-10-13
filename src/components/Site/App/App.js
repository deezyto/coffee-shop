import React from 'react';
import MainPage from '../pages/MainPage';
import ShopPage from '../pages/ShopPage';
import CoffeePage from '../pages/CoffeePage';
import Panel from '../Panel/Panel';
import { createRef } from 'react';
import { createBrowserRouter, useLocation, useOutlet, RouterProvider } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './transition.css';

const routes = [
  { path: '/', name: 'MainPage', element: <MainPage />, nodeRef: createRef() },
  { path: '/shop', name: 'ShopPage', element: <ShopPage />, nodeRef: createRef() },
  { path: '/coffee-page', name: 'CoffeePage', element: <CoffeePage />, nodeRef: createRef() },
  { path: '*', name: 'NotFound', element: <h1>Page not found</h1>, nodeRef: createRef() }
]

const router = createBrowserRouter([
  {
    path: '/',
    element: <Router />,
    children: routes.map((route) => ({
      index: route.path === '/',
      path: route.path === '/' ? undefined : route.path,
      element: route.element,
    })),
  },
])


function Router() {
  const location = useLocation();
  const currentOutlet = useOutlet();
  const { nodeRef } =
  routes.find((route) => route.path === location.pathname) ?? {};
  return (
      <>
        <SwitchTransition>
          <CSSTransition
            key={location.pathname}
            nodeRef={nodeRef}
            timeout={300}
            classNames="page"
            unmountOnExit
          >
            {(state) => (
              <div ref={nodeRef} className="app">
                <Panel />
                {currentOutlet}
              </div>
            )}
          </CSSTransition>
        </SwitchTransition>
      </>
  )
}

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App;
