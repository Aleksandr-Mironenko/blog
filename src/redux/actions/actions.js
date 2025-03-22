import { format, parseISO } from 'date-fns'

import { like, deleteLike } from '../../api/api-like'
import { createUser, editUser, checkUser, loginToken } from '../../api/api-user'
import { getBlogElements, createBlogElement, deleteBlogElement, updateBlogElement } from '../../api/api-elements'

export const sizeMonitor = (size = window.innerWidth) => ({ type: 'SIZE_MONITOR', size })
export const pushPosts = (posts) => ({ type: 'PUSH_POSTS', posts })
export const loadEnd = () => ({ type: 'LOAD_END' })
export const loadStart = () => ({ type: 'LOAD_START' })
export const errorFetch = (bool) => ({ type: 'ERROR_FETCH', bool })
export const changePage = (page) => ({ type: 'CHANGE_PAGE', page, meta: { delayMs: 1000 } }) //можно было добавить всем meta
export const offline = (bool) => ({ type: 'OFFLINE', bool })
export const changeFavorire = (bool, id) => ({ type: 'CHANGE_FAVORITE', bool, id })
export const logOut = () => ({ type: 'LOGOUT' })

export const isAvtorized = (dataUser) => ({
  type: 'AVTORIZED',
  email: dataUser.email,
  token: dataUser.token,
  username: dataUser.username,
})

export const listenerOnline = () => {
  return (dispatch) =>
    window.addEventListener('offline', () => {
      dispatch(offline(true))
    })
}

export const listenerOffline = () => {
  return (dispatch) =>
    window.addEventListener('online', () => {
      dispatch(offline(false))
    })
}

export const login = (dataUser) => {
  return {
    type: 'LOGIN',
    email: dataUser.email,
    token: dataUser.token,
    username: dataUser.username,
    bio: dataUser.bio ? dataUser.bio : '',
    image: dataUser.image ? dataUser.image : '',
    meta: { delayMs: 1000 },
  }
}

const formatter = (array) => {
  return array.map((item, index) => {
    return {
      authorUserName: item.author.username,
      authorImage: item.author.image,
      id: index,
      slug: item.slug,
      title: item.title,
      description: item.description,
      body: item.body,
      tagList: item.tagList,
      createdAt: format(parseISO(item.createdAt), 'MMMM d, yyyy'),
      updatedAt: format(parseISO(item.updatedAt), 'MMMM d, yyyy'),
      favorited: item.favorited,
      favoritesCount: item.favoritesCount,
    }
  })
}

export const newUser = (data, retries = 5) => {
  return async (dispatch) => {
    try {
      const content = await createUser(data)
      dispatch(isAvtorized(content))
      localStorage.setItem('token', JSON.stringify(content.user.token))
    } catch (error) {
      if (retries <= 0) {
        dispatch(loadEnd())
        dispatch(errorFetch(true))
        return
      }
      dispatch(newUser(data, retries - 1))
    }
  }
}

export const editProfile = (data, retries = 5) => {
  return async (dispatch) => {
    if (retries <= 0) {
      dispatch(loadEnd())
      dispatch(errorFetch(true))
      return
    }
    try {
      const content = await editUser(data)
      dispatch(login(content.user))
      dispatch(getPosts())
    } catch (error) {
      dispatch(editProfile(data, retries - 1))
    }
  }
}

export const oldUser = (data, retries = 5) => {
  return async (dispatch) => {
    if (retries <= 0) {
      dispatch(loadEnd())
      dispatch(errorFetch(true))
      return
    }
    try {
      const content = await checkUser(data)
      dispatch(login(content.user))
      localStorage.setItem('token', JSON.stringify(content.user.token))
    } catch (error) {
      dispatch(oldUser(data, retries - 1))
    }
  }
}

export const logOutLocalStorage = () => {
  return async (dispatch) => {
    localStorage.removeItem('token')
    dispatch(logOut())
  }
}

export const getPosts = (page, retries = 5) => {
  return async (dispatch) => {
    dispatch(loadStart)

    if (retries <= 0) {
      dispatch(loadEnd())
      dispatch(errorFetch(true))
      return
    }
    try {
      const content = await getBlogElements(page)
      const posts = formatter(content.articles)
      dispatch(pushPosts(posts))
    } catch (error) {
      dispatch(getPosts(page, retries - 1)) //
    }
  }
}

export const dataPoToken = (token, retries = 5) => {
  return async (dispatch) => {
    if (retries <= 0) {
      dispatch(loadEnd())
      dispatch(errorFetch(true))
      return
    }
    try {
      const content = await loginToken(token)
      dispatch(login(content.user))
      dispatch(getPosts())
    } catch (error) {
      dispatch(getPosts(token, retries - 1)) //
    }
  }
}

export const getToken = () => {
  return async (dispatch) => {
    const token = localStorage.getItem('token') && JSON.parse(localStorage.getItem('token'))

    if (token) {
      dispatch(dataPoToken(token))
      return { type: 'LOCATION_CHANGE' }
    }
  }
}

export const createPost = (data, retries = 5) => {
  return async (dispatch) => {
    if (retries <= 0) {
      dispatch(loadEnd())
      dispatch(errorFetch(true))
      return
    }
    try {
      await createBlogElement(data)
      dispatch(getPosts(1))
    } catch (error) {
      dispatch(createPost(data, retries - 1))
    }
  }
}

export const deletePost = (slug, token, retries = 5) => {
  return async (dispatch) => {
    if (retries <= 0) {
      dispatch(loadEnd())
      dispatch(errorFetch(true))
      return
    }
    try {
      await deleteBlogElement(slug, token)
      dispatch(getPosts(1))
    } catch (error) {
      dispatch(deletePost(slug, token, retries - 1))
    }
  }
}

export const updateArticle = (data, retries = 5) => {
  return async (dispatch) => {
    if (retries <= 0) {
      dispatch(loadEnd())
      dispatch(errorFetch(true))
      return
    }
    try {
      await updateBlogElement(data)
      dispatch(getPosts(1))
    } catch (error) {
      dispatch(updateArticle(data, retries - 1))
    }
  }
}

export const favorite = (slug, token, id, retries = 5) => {
  return async (dispatch) => {
    if (retries <= 0) {
      dispatch(loadEnd())
      dispatch(errorFetch(true))
      return
    }
    try {
      const content = await like(slug, token)
      dispatch(changeFavorire(content.article.favorited, id))
    } catch (error) {
      dispatch(favorite(slug, token, id, retries - 1))
    }
  }
}

export const noFavorite = (slug, token, id, retries = 5) => {
  return async (dispatch) => {
    if (retries <= 0) {
      dispatch(loadEnd())
      dispatch(errorFetch(true))
      return
    }

    try {
      const content = await deleteLike(slug, token)
      dispatch(changeFavorire(content.article.favorited, id))
      dispatch(getPosts(1))
    } catch (error) {
      dispatch(noFavorite(slug, token, id, retries - 1))
    }
  }
}
