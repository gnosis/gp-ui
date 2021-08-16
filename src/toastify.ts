import { Toast, ToastContainerProps, ToastContent, ToastId, ToastOptions } from 'react-toastify'

type ToastMethods = Exclude<keyof Toast, 'TYPE' | 'POSITION'>

const methods: ToastMethods[] = [
  'success',
  'info',
  'warn',
  'error',
  'isActive',
  'dismiss',
  'update',
  'onChange',
  'done',
  'configure',
]

type ToastPromised = {
  [K in ToastMethods]: (...args: Parameters<Toast[K]>) => Promise<ReturnType<Toast[K]>>
}

const properties = methods.reduce((accum, method) => {
  accum[method] = {
    get:
      (): ToastContent =>
      (
        ...args: [
          (((((ToastContent & ToastId) & (ToastId | undefined)) & ToastId) &
            ((count?: number | undefined, containerId?: string | number | undefined) => void)) &
            ToastId) &
            (ToastContainerProps | undefined),
          ToastOptions | undefined,
        ]
      ): Promise<string | number | boolean | void> =>
        import(
          /* webpackChunkName: "toastify"*/
          './setupToastify'
        ).then(({ toast }) => toast[method](...args)),
  }
  return accum
}, {}) as {
  [K in ToastMethods]: ToastPromised[K]
}

const toastFunc = (...args: Parameters<Toast>): Promise<ReturnType<Toast>> =>
  import(
    /* webpackChunkName: "toastify"*/
    './setupToastify'
  ).then(({ toast }) => toast(...args))

export const toast = Object.defineProperties(
  toastFunc,
  properties as PropertyDescriptorMap & ThisType<Toast>,
) as unknown as ToastPromised
