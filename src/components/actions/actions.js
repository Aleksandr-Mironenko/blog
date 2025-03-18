import { format, parseISO } from 'date-fns'
const baseurl = 'https://blog-platform.kata.academy/api/'
export const sizeMonitor = (size = window.innerWidth) => ({ type: 'SIZE_MONITOR', size })
export const pushPosts = (posts) => ({ type: 'PUSH_POSTS', posts })
export const loadEnd = () => ({ type: 'LOAD_END' })
export const loadStart = () => ({ type: 'LOAD_START' })
export const errorFetch = (bool) => ({ type: 'ERROR_FETCH', bool })
export const changePage = (page) => ({ type: 'CHANGE_PAGE', page, meta: { delayMs: 1000 } }) //можно было добавить всем meta
export const haveCookie = (token) => ({ type: 'HAVE_TOKEN', token })
export const offline = (bool) => ({ type: 'OFFLINE', bool })

export const changeFavorire = (bool, id) => ({ type: 'CHANGE_FAVORITE', bool, id })

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

export const logOut = () => ({ type: 'LOGOUT' })

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
      const response = await fetch(`${baseurl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: data }),
      })

      if (!response.ok) {
        throw new Error()
      } else {
        const content = await response.json()
        document.cookie = `token = ${content.token}; `
        dispatch(isAvtorized(content))
      }
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

export const saveUserData = (data, retries = 5) => {
  return async (dispatch) => {
    if (retries <= 0) {
      dispatch(loadEnd())
      dispatch(errorFetch(true))
      return
    }
    try {
      const response = await fetch(`${baseurl}user`, {
        method: 'PUT',
        headers: {
          Authorization: `Token ${data.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            email: data.email,
            username: data.userName,
            bio: data.bio || 'I work at State Farm.',
            image: data.userPhoto || null,
            password: data.password,
          },
        }),
      })

      if (!response.ok) {
        throw new Error()
      } else {
        const content = await response.json()
        dispatch(login(content.user))
        dispatch(getPosts())
      }
    } catch (error) {
      dispatch(saveUserData(data, retries - 1))
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
      const response = await fetch(`${baseurl}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: { email: data.email, password: data.password } }),
      })

      if (!response.ok) {
        throw new Error()
      } else {
        const content = await response.json()
        document.cookie = `token = ${content.user.token}; SameSite=None; Secure;`
        dispatch(login(content.user))
      }
    } catch (error) {
      dispatch(oldUser(data, retries - 1))
    }
  }
}

export const logOutCookie = () => {
  return async (dispatch) => {
    document.cookie = 'token =  ; expires = Thu, 01 Jan 1970 00:00:00 GMT; path = /;'
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
      const searchContent = await fetch(`${baseurl}/articles?limit=5&offset=${(page - 1) * 5}`)

      if (!searchContent.ok) {
        throw new Error()
      } else {
        const content = await searchContent.json()
        const posts = formatter(content.articles)
        dispatch(pushPosts(posts))
      }
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
      const searchContent = await fetch(`${baseurl}user`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!searchContent.ok) {
        throw new Error()
      } else {
        const content = await searchContent.json()
        dispatch(login(content.user))
        dispatch(getPosts())
      }
    } catch (error) {
      dispatch(getPosts(token, retries - 1)) //
    }
  }
}

export const getCookie = (name) => {
  return async (dispatch) => {
    const cookieName = name + '='
    const decodedCookie = decodeURIComponent(document.cookie)
    const cookieArray = decodedCookie.split(';')
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i]
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1)
      }
      if (cookie.indexOf(cookieName) === 0) {
        const token = cookie.substring(cookieName.length, cookie.length)
        dispatch(dataPoToken(token))
        return { type: 'LOCATION_CHANGE' }
      }
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
      const response = await fetch(`${baseurl}articles`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${data.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article: {
            title: data.title,
            description: data.description,
            body: data.text,
            tagList: data.tagList,
          },
        }),
      })

      if (!response.ok) {
        throw new Error()
      } else {
        dispatch(getPosts(1))
      }
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
      const response = await fetch(`${baseurl}articles/${slug}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error()
      } else {
        dispatch(getPosts(1))
      }
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
      const response = await fetch(`${baseurl}articles/${data.slug} `, {
        method: 'PUT',
        headers: {
          Authorization: `Token ${data.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article: {
            title: data.title,
            description: data.description,
            body: data.text,
            tagList: data.tagList,
          },
        }),
      })

      if (!response.ok) {
        throw new Error()
      } else {
        dispatch(getPosts(1))
      }
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
      const response = await fetch(`${baseurl}articles/${slug}/favorite`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error()
      } else {
        const content = await response.json()
        dispatch(changeFavorire(content.article.favorited, id))
      }
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
      const response = await fetch(`${baseurl}articles/${slug}/favorite`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error()
      } else {
        const content = await response.json()
        dispatch(changeFavorire(content.article.favorited, id))
        dispatch(getPosts(1))
      }
    } catch (error) {
      dispatch(noFavorite(slug, token, id, retries - 1))
    }
  }
}
