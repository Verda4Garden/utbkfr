import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TryoutSession from './pages/TryoutSession';
import Tryouts from './pages/Tryouts';
import Materials from './pages/Materials';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import HelpCenter from './pages/HelpCenter';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    console.log('Setting up auth listener...');
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Auth state changed:', currentUser ? `User: ${currentUser.email}` : 'No user');
      
      try {
        if (currentUser) {
          console.log('Fetching user data for:', currentUser.uid);
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          
          if (userDoc.exists()) {
            console.log('User data found');
            setUserData(userDoc.data());
          } else {
            console.log('Creating new user profile...');
            const newData = {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              email: currentUser.email,
              photoURL: currentUser.photoURL,
              targetFK: 'FK UI', // Default
              xp: 0,
              level: 1,
              badges: [],
              streak: 0,
              lastActive: new Date().toISOString(),
              role: 'user'
            };
            await setDoc(doc(db, 'users', currentUser.uid), newData);
            console.log('New user profile created');
            setUserData(newData);
          }
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error('Error in auth state change handler:', error);
      } finally {
        setUser(currentUser);
        setLoading(false);
        console.log('Auth initialization complete');
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F5F5F0]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5A5A40]"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#F5F5F0] text-[#1a1a1a] font-sans">
        {user && <Navbar user={user} userData={userData} />}
        <div className="flex">
          {user && <Sidebar />}
          <main className={`flex-1 ${user ? 'p-4 md:p-8' : ''}`}>
            <Routes>
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
              <Route path="/" element={user ? <Dashboard userData={userData} /> : <Navigate to="/login" />} />
              <Route path="/tryouts" element={user ? <Tryouts /> : <Navigate to="/login" />} />
              <Route path="/tryout/:id" element={user ? <TryoutSession /> : <Navigate to="/login" />} />
              <Route path="/materials" element={user ? <Materials /> : <Navigate to="/login" />} />
              <Route path="/leaderboard" element={user ? <Leaderboard /> : <Navigate to="/login" />} />
              <Route path="/profile" element={user ? <Profile userData={userData} /> : <Navigate to="/login" />} />
              <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
              <Route path="/help" element={user ? <HelpCenter /> : <Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
