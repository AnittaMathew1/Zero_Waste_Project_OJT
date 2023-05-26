import React, { useState } from 'react'
import PropTypes from 'prop-types'

//function for setting auth context
export const AuthContext = React.createContext({
  token: null,
  isLoggedIn: false,
  login: (token) => {},
  setUser: (user) => {},
  logout: () => {},
})

//function for setting auth context during login and logout
export const AuthContextProvider = (props) => {
  const [token, setToken] = useState(null)
  const userIsLoggedIn = !!token
  const logoutHandler = () => {
    setToken(null)
  }
  const loginHandler = (token) => {
    setToken(token)
  }
  const contextValue = {
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  }
  return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
}

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
export default AuthContext
