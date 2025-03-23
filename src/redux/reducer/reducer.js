const initialState = {
  authorized: false,
  error: false,
  errorMessage: '',
  loginError: false,
  loading: false,
  offline: false,
  userName: '',
  userPhoto: '',
  emailAddress: '',
  token: '',
  bio: '',
  page: 1,
  pageQty: 5,
  posts: [],
  sizeMonitor: window.innerWidth,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PUSH_POSTS': {
      return { ...state, posts: [...action.posts] }
    }
    case 'ERROR_FETCH': {
      return { ...state, error: action.bool, errorMessage: action.message }
    }
    case 'LOAD_START': {
      return { ...state, loading: true }
    }
    case 'LOAD_END': {
      return { ...state, loading: false }
    }
    case 'CHANGE_PAGE': {
      return { ...state, page: action.page }
    }
    case 'CHANGE_PAGEQTY': {
      return { ...state, pageQty: action.pageQty }
    }
    case 'OFFLINE':
      return {
        ...state,
        offline: action.bool,
      }
    case 'AVTORIZED': {
      return {
        ...state,
        authorized: true,

        emailAddress: action.email,
        token: action.token,
        userName: action.username,
      }
    }
    case 'LOGIN': {
      return {
        ...state,
        authorized: true,

        emailAddress: action.email,
        token: action.token,
        userName: action.username,
        bio: action.bio,
        userPhoto: action.image,
      }
    }
    case 'LOGOUT': {
      return {
        ...state,
        authorized: false,

        emailAddress: '',
        token: '',
        userName: '',
        bio: '',
        userPhoto: '',
      }
    }

    case 'CHANGE_FAVORITE': {
      return {
        ...state,
        posts: [
          ...state.posts.slice(0, action.id),
          { ...state.posts[action.id], favorited: action.bool },
          ...state.posts.slice(action.id + 1),
        ],
      }
    }

    case 'SIZE_MONITOR': {
      return {
        ...state,
        sizeMonitor: action.size,
      }
    } //если нужно будет добавить мобильные экраны
    case 'LOGIN_ERROR': {
      return {
        ...state,
        loginError: action.bool,
      }
    }
    default:
      return { ...state }
  }
}

export default reducer
