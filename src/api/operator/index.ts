import * as realApi from './operatorApi'
import * as mockApi from './operatorMock'
export * from './types'

const useMock = process.env.MOCK_OPERATOR

// Re-exporting the result, mocked or not.
// Unfortunately, did not find a way to export
// a mix of mock/real implementations
// without manually naming the exports
export const {
  // functions that have a mock
  getOrder,
  getOrders,
  // functions that do not have a mock
  getOrderLink = realApi.getOrderLink,
  postSignedOrder = realApi.postSignedOrder,
  getFeeQuote = realApi.getFeeQuote,
  // function that only have a mock
  getTrades = mockApi.getTrades,
} = useMock ? { ...mockApi } : { ...realApi }
