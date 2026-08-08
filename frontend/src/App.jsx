// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Открытые маршруты */}
        <Route path="/login" element={<LoginPage />} />

        {/* Защищённые маршруты — обёрнуты в PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<ChatPage />} />
          {/* Если бы была ещё страница профиля: */}
          {/* <Route path="/profile" element={<ProfilePage />} /> */}
        </Route>

        {/* 404 страница — должна быть последней */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
