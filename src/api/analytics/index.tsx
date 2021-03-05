import ReactGA, { InitializeOptions } from 'react-ga'
import { isMobile } from 'react-device-detect'
import { AnalyticsDimension } from 'types'
export { pageview as viewPage, event as triggerEvent, set as setDimensions } from 'react-ga'

function getCustomBrowserType(): string {
  if (isMobile) {
    return window.ethereum ? 'Mobile web3' : 'Mobile regular'
  } else {
    return window.web3 ? 'Desktop web3' : 'Desktop regular'
  }
}

interface InitAnalyticsParams {
  /**
   * UA Analytics code
   */
  trackingCode?: string

  /**
   * React-ga init options.
   *
   * See https://github.com/react-ga/react-ga
   */
  options?: InitializeOptions

  /**
   * Map a dimension to the actual key name.
   *
   * Two different apps can use different dimension for the same concept, this is why, every app can specify the
   * dimension name for each type.
   *
   * dimensionsKey maps the logical name defined in the constant, to
   *
   */
  dimensionNames?: Record<AnalyticsDimension, string>
}

export function initAnalytics(params: InitAnalyticsParams): void {
  const { trackingCode, options, dimensionNames = {} } = params
  if (typeof trackingCode === 'string') {
    ReactGA.initialize(trackingCode, options)
  } else {
    ReactGA.initialize('test', { testMode: true, debug: true })
  }

  // Set the browser dimension
  const browserTypeDimension = dimensionNames[AnalyticsDimension.BROWSER_TYPE]
  console.log('browserTypeDimension', browserTypeDimension)
  if (browserTypeDimension) {
    ReactGA.set({
      [browserTypeDimension]: getCustomBrowserType(),
    })
  }

  // Track errors
  window.addEventListener('error', (error) => {
    ReactGA.exception({
      description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
      fatal: true,
    })
  })
}
