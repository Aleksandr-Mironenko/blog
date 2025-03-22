const baseurl = 'https://blog-platform.kata.academy/api/'

export const getBlogElements = async (page) => {
  const response = await fetch(`${baseurl}/articles?limit=5&offset=${(page - 1) * 5}`)

  if (!response.ok) {
    throw new Error()
  } else {
    const result = await response.json()
    console.log(result)
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
    throw new Error()
  } else {
    console.log('СОЗДАНИЕ ПОСТА ВЫПОЛНЕНО')
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
    console.log('ОШИБА ЭТА СРАНАЯ')
    throw new Error('ОШИБКА В deleteBlogElement')
  } else {
    console.log('УДАЛЕНИЕ ПОСТА ВЫПОЛНЕНО')
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
    throw new Error()
  } else {
    console.log('ОБНОВЛЕНИЕ ПОСТА ВЫПОЛНЕНО')
  }
}
