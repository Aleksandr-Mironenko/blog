const baseurl = 'https://blog-platform.kata.academy/api'

export const like = async (slug, token) => {
  const response = await fetch(`${baseurl}/articles/${slug}/favorite`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Не удалось поставить отметку')
  } else {
    const result = await response.json()
    return result
  }
}

export const deleteLike = async (slug, token) => {
  const response = await fetch(`${baseurl}/articles/${slug}/favorite`, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Не удалось снять отметку')
  } else {
    const result = await response.json()
    return result
  }
}
