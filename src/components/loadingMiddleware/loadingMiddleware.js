import actions from '../actions'

const loadingMiddleware = (history) => (store) => {
  const { loadStart, loadEnd } = actions
  let timer = null

  const handleLocationChange = (location, action) => {
    store.dispatch(loadStart())

    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      store.dispatch(loadEnd())
    }, 1000)
    return () => {
      clearTimeout(timer)
    }
  }

  history.listen(handleLocationChange)

  return (next) => (action) => {
    const result = next(action)
    return result
  }
}

export default loadingMiddleware
