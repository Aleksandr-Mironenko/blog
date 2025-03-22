const baseurl = 'https://blog-platform.kata.academy/api/'

export const createUser = async (data) => {
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
    const result = await response.json()
    console.log(result)
    return result
  }
}

export const editUser = async (data) => {
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
    const result = await response.json()
    console.log(result)
    return result
  }
}

export const checkUser = async (data) => {
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
    const result = await response.json()
    console.log(result)
    return result
  }
}

export const loginToken = async (token) => {
  const response = await fetch(`${baseurl}user`, {
    method: 'GET',
    headers: {
      Authorization: `Token ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error()
  } else {
    const result = await response.json()
    console.log(result)
    return result
  }
}
