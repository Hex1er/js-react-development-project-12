import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotFoundPage from './pages/NotFoundPage'
import PrivateRoute from './components/PrivateRoute'
import Header from './components/Header'

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column h-100">
        <Header />
        <div className="flex-grow-1">
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<ChatPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
