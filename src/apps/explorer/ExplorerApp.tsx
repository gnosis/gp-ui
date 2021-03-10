import React from 'react'
import { BrowserRouter, HashRouter, Redirect, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'

import { withGlobalContext } from 'hooks/useGlobalState'
import useNetworkCheck from 'hooks/useNetworkCheck'
import Console from 'Console'
import { rootReducer, INITIAL_STATE } from 'apps/explorer/state'

import styled from 'styled-components'
import { GenericLayout } from 'components/layout'
import { Header } from './layout/Header'
import { media } from 'theme/styles/media'

import { NetworkUpdater } from 'state/network'
import { initAnalytics } from 'api/analytics'
import RouteAnalytics from 'components/analytics/RouteAnalytics'
import NetworkAnalytics from 'components/analytics/NetworkAnalytics'
import { DIMENSION_NAMES } from './const'

// Init analytics
const GOOGLE_ANALYTICS_ID: string | undefined = process.env.GOOGLE_ANALYTICS_ID
initAnalytics({
  trackingCode: GOOGLE_ANALYTICS_ID,
  dimensionNames: DIMENSION_NAMES,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Router: typeof BrowserRouter & typeof HashRouter = (window as any).IS_IPFS ? HashRouter : BrowserRouter

const NotFound = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Extra_routes_chunk"*/
      './pages/NotFound'
    ),
)

const Home = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Trade_chunk"*/
      './pages/Home'
    ),
)

const Order = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Order_chunk"*/
      './pages/Order'
    ),
)

/**
 * Update the global state
 */
export function StateUpdaters(): JSX.Element {
  return <NetworkUpdater />
}

const Analytics = (): JSX.Element => (
  <>
    <Route component={RouteAnalytics} />
    <Route component={NetworkAnalytics} />
  </>
)

/** App content */
const AppContent = (): JSX.Element => {
  const { path } = useRouteMatch()

  const pathPrefix = path == '/' ? '' : path

  return (
    <GenericLayout header={<Header />}>
      <React.Suspense fallback={null}>
        <Analytics />

        <Switch>
          <Route path={pathPrefix + '/'} exact component={Home} />
          <Route path={pathPrefix + '/orders/:orderId'} exact component={Order} />
          <Route component={NotFound} />
        </Switch>
      </React.Suspense>
    </GenericLayout>
  )
}

/** Redirects to the canonnical URL for mainnet */
const RedirectMainnet = (): JSX.Element => {
  const { pathname } = useLocation()

  const pathMatchArray = pathname.match('/mainnet(.*)')
  const newPath = pathMatchArray && pathMatchArray.length > 0 ? pathMatchArray[1] : '/'

  return <Redirect push={false} to={newPath} />
}

const Wrapper = styled.div`
  max-width: 140rem;
  margin: 0 auto;

  ${media.mediumDown} {
    max-width: 94rem;
    flex-flow: column wrap;
  }

  ${media.mobile} {
    max-width: 100%;
  }
`

/**
 * Render Explorer App
 */
export const ExplorerApp: React.FC = () => {
  // Deal with incorrect network
  useNetworkCheck()

  return (
    <Wrapper>
      <Router basename={process.env.BASE_URL}>
        <StateUpdaters />
        <Switch>
          <Route path="/mainnet" component={RedirectMainnet} />
          <Route path={['/xdai', '/rinkeby', '/']} component={AppContent} />
        </Switch>
      </Router>
      {process.env.NODE_ENV === 'development' && <Console />}
    </Wrapper>
  )
}

export default hot(
  withGlobalContext(
    ExplorerApp,
    // Initial State
    INITIAL_STATE,
    rootReducer,
  ),
)
