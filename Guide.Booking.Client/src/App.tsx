import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookingList from './pages/BookingList';
import BookingDetails from './pages/BookingDetails';
import BookingForm from './pages/BookingForm';
import NotFound from './pages/NotFound';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/bookings"
          element={isAuthenticated ? <BookingList /> : <Navigate to="/login" />}
        />
        <Route
          path="/bookings/:id"
          element={isAuthenticated ? <BookingDetails /> : <Navigate to="/login" />}
        />
        <Route path="/create-booking" element={<BookingForm />} />
        {/* Catch-all route for 404 */}
        <Route 
          path="*" 
          element={isAuthenticated ? <NotFound /> : <Navigate to="/login" replace />} 
        />
      </Routes>
    </Layout>
  );
}

export default App;
