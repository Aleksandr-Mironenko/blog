import { format, parseISO } from 'date-fns'

import { like, deleteLike } from '../../api/api-like'
import { createUser, editUser, checkUser, loginToken } from '../../api/api-user'
import { getBlogElements, createBlogElement, deleteBlogElement, updateBlogElement } from '../../api/api-elements'

export const sizeMonitor = (size = window.innerWidth) => ({ type: 'SIZE_MONITOR', size })
export const pushPosts = (posts) => ({ type: 'PUSH_POSTS', posts })
export const loadEnd = () => ({ type: 'LOAD_END' })
export const loadStart = () => ({ type: 'LOAD_START' })
export const errorFetch = (bool, message) => ({ type: 'ERROR_FETCH', bool, message })
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

export const newUser = (data, message = '', retries = 5) => {
  return async (dispatch) => {
    if (retries <= 0) {
      dispatch(loadEnd())
      if (message === 'Failed to fetch') {
        message = 'Не удалось зарегистрироваться'
      }
      dispatch(errorFetch(true, message))
      return
    }
    try {
      const content = await createUser(data)
      dispatch(isAvtorized(content))
      localStorage.setItem('token', JSON.stringify(content.user.token))
    } catch (error) {
      dispatch(newUser(data, error.message, retries - 1))
    }
  }
}

export const editProfile = (data, message = '', retries = 5) => {
  return async (dispatch) => {
    if (retries <= 0) {
      dispatch(loadEnd())
      if (message === 'Failed to fetch') {
        message = 'Не удалось отредактировать профиль'
      }
      dispatch(errorFetch(true, message))
      return
    }
    try {
      const content = await editUser(data)
      dispatch(login(content.user))
      dispatch(getPosts())
    } catch (error) {
      dispatch(editProfile(data, error.message, retries - 1))
    }
  }
}

export const oldUser = (data, message = '', retries = 5) => {
  return async (dispatch) => {
    if (retries <= 0) {
      dispatch(loadEnd())
      if (message === 'Failed to fetch') {
        message = 'Не удалось войти в профиль'
      }
      dispatch(errorFetch(true, message))
      return
    }
    try {
      const content = await checkUser(data)
      dispatch(login(content.user))
      localStorage.setItem('token', JSON.stringify(content.user.token))
    } catch (error) {
      dispatch(oldUser(data, error.message, retries - 1))
    }
  }
}

export const logOutLocalStorage = () => {
  return async (dispatch) => {
    localStorage.removeItem('token')
    dispatch(logOut())
  }
}

export const getPosts = (page, message = '', retries = 5) => {
  return async (dispatch) => {
    dispatch(loadStart)
    if (retries <= 0) {
      dispatch(loadEnd())
      if (message === 'Failed to fetch') {
        message = 'Не удалось загрузить посты'
      }
      dispatch(errorFetch(true, message))
      return
    }
    try {
      const content = await getBlogElements(page)
      const posts = formatter(content.articles)
      dispatch(pushPosts(posts))
    } catch (error) {
      dispatch(getPosts(page, error.message, retries - 1)) //
    }
  }
}

export const dataPoToken = (token, message, retries = 5) => {
  return async (dispatch) => {
    if (retries <= 0) {
      dispatch(loadEnd())
      if (message === 'Failed to fetch') {
        message = 'Не удалось получить данные по токену'
      }
      dispatch(errorFetch(true, message))
      return
    }
    try {
      const content = await loginToken(token)
      dispatch(login(content.user))
      dispatch(getPosts())
    } catch (error) {
      dispatch(getPosts(token, error.message, retries - 1)) //
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

export const createPost = (data, message = '', retries = 5) => {
  return async (dispatch) => {
    if (retries <= 0) {
      dispatch(loadEnd())
      if (message === 'Failed to fetch') {
        message = 'Не удалось создать пост'
      }
      dispatch(errorFetch(true, message))
      return
    }
    try {
      await createBlogElement(data)
      dispatch(getPosts(1))
    } catch (error) {
      dispatch(createPost(data, error.message, retries - 1))
    }
  }
}

export const deletePost = (slug, token, message = '', retries = 5) => {
  return async (dispatch) => {
    if (retries <= 0) {
      dispatch(loadEnd())
      if (message === 'Failed to fetch') {
        message = 'Не удалось удалить пост'
      }
      dispatch(errorFetch(true, message))
      return
    }
    try {
      await deleteBlogElement(slug, token)
      dispatch(getPosts(1))
    } catch (error) {
      dispatch(deletePost(slug, token, error.message, retries - 1))
    }
  }
}

export const updateArticle = (data, message = '', retries = 5) => {
  return async (dispatch) => {
    if (retries <= 0) {
      dispatch(loadEnd())
      if (message === 'Failed to fetch') {
        message = 'Не удалось отредактировать пост'
      }
      dispatch(errorFetch(true, message))
      return
    }
    try {
      await updateBlogElement(data)
      dispatch(getPosts(1))
    } catch (error) {
      dispatch(updateArticle(data, error.message, retries - 1))
    }
  }
}

export const favorite = (slug, token, id, message = '', retries = 5) => {
  return async (dispatch) => {
    if (retries <= 0) {
      dispatch(loadEnd())
      if (message === 'Failed to fetch') {
        message = 'Не удалось поставить отметку'
      }
      dispatch(errorFetch(true, message))
      return
    }
    try {
      const content = await like(slug, token)
      dispatch(changeFavorire(content.article.favorited, id))
    } catch (error) {
      dispatch(favorite(slug, token, id, error.message, retries - 1))
    }
  }
}

export const noFavorite = (slug, token, id, message = '', retries = 5) => {
  return async (dispatch) => {
    if (retries <= 0) {
      dispatch(loadEnd())
      if (message === 'Failed to fetch') {
        message = 'Не удалось снять отметку'
      }
      dispatch(errorFetch(true, message))
      return
    }

    try {
      const content = await deleteLike(slug, token)
      dispatch(changeFavorire(content.article.favorited, id))
      dispatch(getPosts(1))
    } catch (error) {
      dispatch(noFavorite(slug, token, id, error.message, retries - 1))
    }
  }
}
