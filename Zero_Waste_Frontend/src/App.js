import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import ResetPassword from './views/pages/ForgotPassword/ResetPassword'
import ForgotPassword from './views/pages/ForgotPassword/ForgotPassword'
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const AppHeader = React.lazy(() => import('./components/AppHeader'))
// Pages
const Home = React.lazy(() => import('./views/pages/Home/Home'))
const Type = React.lazy(() => import('./views/pages/Home/Type'))
const About = React.lazy(() => import('./views/pages/About/About'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={loading}>
        <AppHeader />
        <Routes>
          <Route exact path="/register" name="register" element={<Register />} />
          <Route exact path="/home" name="Home" element={<Home />} />
          <Route exact path="/login" name="login" element={<Login />} />
          <Route exact path="/about" name="about" element={<About />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route
            exact
            path="/resetpassword"
            name="Reset Password Page"
            element={<ResetPassword />}
          />
          <Route
            exact
            path="/forgotpassword"
            name="Forgot Password Page"
            element={<ForgotPassword />}
          />
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
