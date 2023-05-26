import constants from 'src/Constants/Header'

//Function for getting full URL
const getFullURL = (endpoint) => {
  return `${process.env.REACT_APP_API_URL}${endpoint}`
}
const getHeader = () => {
  let headers = constants.HEADER
  headers.Authorization = sessionStorage.getItem('jwt')
  return headers
}

// function for get API calls
export const getRequest = (endpoint) => {
  return fetch(getFullURL(endpoint), {
    method: 'GET',
    mode: 'cors',
    headers: getHeader(),
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        handleErrors(response)
      }
    })

    .catch((error) => {
      console.log(error)
    })
}

//Function for post API calls
export const postRequest = (endpoint, data) => {
  return fetch(getFullURL(endpoint), {
    method: 'POST',
    mode: 'cors',
    headers: getHeader(),
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        console.log(response.status)
        handleErrors(response)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

const handleErrors = (errors) => {
  if (errors.status == 401) {
    sessionStorage.removeItem('jwt')
    sessionStorage.removeItem('userId')
    sessionStorage.removeItem('role')
    window.location.replace('/login')
  }
}
