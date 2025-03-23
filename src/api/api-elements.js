const baseurl = 'https://blog-platform.kata.academy/api/'

export const getBlogElements = async (page = 1) => {
  const response = await fetch(`${baseurl}articles?limit=5&offset=${(page - 1) * 5}`)

  if (!response.ok) {
    throw new Error('Не удалось загрузить посты')
  } else {
    const result = await response.json()
    return result
  }
}

export const createBlogElement = async (data) => {
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
    throw new Error('Не удалось создать пост')
  }
}

export const deleteBlogElement = async (slug, token) => {
  const response = await fetch(`${baseurl}articles/${slug}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${token}`,
    },
  })

  if (!response.ok && response.statusText !== 'No Content') {
    throw new Error('Не удалось удалить пост')
  }
}

export const updateBlogElement = async (data) => {
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
    throw new Error('Не удалось отредактировать пост')
  }
}
