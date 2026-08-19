import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logOut } from '../slices/authSlice'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector((state) => state.auth.token)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    dispatch(logOut())
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/">Hexlet Chat</Link>
        {token && (
          <button type="button" className="btn btn-primary" onClick={handleLogout}>
            Выйти
          </button>
        )}
      </div>
    </nav>
  )
}

export default Header
