import actions from '../../redux/actions'
export const delayMiddleware = (store) => (next) => (action) => {
  const { loadStart, loadEnd } = actions
  const delayMs = action?.meta?.delayMs
  if (!delayMs) {
    return next(action)
  }
  store.dispatch(loadStart())
  next(action)
  const timerId = setTimeout(() => {
    store.dispatch(loadEnd())
  }, delayMs)
  return () => {
    clearTimeout(timerId)
  }
}
