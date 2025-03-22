const baseurl = 'https://blog-platform.kata.academy/api/'

export const like = async (slug, token) => {
  console.log('связаны')
  const response = await fetch(`${baseurl}articles/${slug}/favorite`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to like post')
  } else {
    const result = await response.json()
    console.log(result)
    return result
  }
}

export const deleteLike = async (slug, token) => {
  const response = await fetch(`${baseurl}articles/${slug}/favorite`, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to dislike post')
  } else {
    const result = await response.json()
    console.log(result)
    return result
  }
}
