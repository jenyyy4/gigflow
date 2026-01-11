import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { checkAuth } from './store/slices/authSlice';
import { addNotification } from './store/slices/notificationSlice';
import { updateGigInList, addGigToList } from './store/slices/gigSlice';
import { addBidToGig } from './store/slices/bidSlice';
import { initSocket, joinUserRoom, disconnectSocket } from './utils/socket';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Gigs from './pages/Gigs';
import GigDetail from './pages/GigDetail';
import CreateGig from './pages/CreateGig';
import MyGigs from './pages/MyGigs';
import MyBids from './pages/MyBids';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const dispatch = useDispatch();
  const { isLoading, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const socket = initSocket();
      joinUserRoom(user._id);

      socket.on('hired', (data) => {
        dispatch(addNotification({
          type: 'success',
          title: 'Congratulations!',
          message: data.message,
          gigId: data.gig._id,
        }));
        toast.success(data.message, {
          duration: 6000,
          icon: '🎉',
        });
      });

      socket.on('bidRejected', (data) => {
        dispatch(addNotification({
          type: 'info',
          title: 'Bid Update',
          message: data.message,
          gigId: data.gigId,
        }));
      });

      socket.on('newBid', (data) => {
        dispatch(addNotification({
          type: 'info',
          title: 'New Bid!',
          message: data.message,
          gigId: data.bid.gigId._id,
        }));
        dispatch(addBidToGig({
          gigId: data.bid.gigId._id,
          bid: data.bid,
        }));
        toast.success(data.message, {
          icon: '📩',
        });
      });

      socket.on('gigUpdated', (gig) => {
        dispatch(updateGigInList(gig));
      });

      socket.on('newGig', (gig) => {
        dispatch(addGigToList(gig));
      });

      return () => {
        socket.off('hired');
        socket.off('bidRejected');
        socket.off('newBid');
        socket.off('gigUpdated');
        socket.off('newGig');
      };
    } else {
      disconnectSocket();
    }
  }, [isAuthenticated, user, dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="animated-bg" />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/gigs" element={<Gigs />} />
            <Route path="/gigs/create" element={<CreateGig />} />
            <Route path="/gigs/:id" element={<GigDetail />} />
            <Route path="/my-gigs" element={<MyGigs />} />
            <Route path="/my-bids" element={<MyBids />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
