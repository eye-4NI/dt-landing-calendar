import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Typography, CssBaseline, Container } from '@mui/material';
import CustomCalendar from './components/Calendar';
import Activity from './components/Activities';
import AdminPanel from './components/AdminPanel';
import Auth from './components/Auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [calendarEvents] = useState([
    {
      title: 'Project Deadline',
      start: new Date(2025, 2, 15),
      end: new Date(2025, 2, 15)
    },
    {
      title: 'Team Meeting',
      start: new Date(2025, 2, 20),
      end: new Date(2025, 2, 20)
    }
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'activities'), (snapshot) => {
      setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  if (!user) return <Auth setUser={setUser} />;

  return (
    <Container maxWidth="lg">
      <CssBaseline />
      <Typography variant="h2" gutterBottom>Dream Team Portal</Typography>
      
      <section style={{ margin: '2rem 0' }}>
        <Typography variant="h4" gutterBottom>March 2025 Schedule</Typography>
        <CustomCalendar events={calendarEvents} />
      </section>

      <section style={{ margin: '2rem 0' }}>
        <Typography variant="h4" gutterBottom>Team Activities</Typography>
        {activities.map(activity => (
          <Activity 
            key={activity.id} 
            activity={activity}
            userId={user.uid}
            isAdmin={user.email?.endsWith('@admin.com')} // Simple admin check
          />
        ))}
      </section>

      {user.email?.endsWith('@admin.com') && <AdminPanel />}
    </Container>
  );
}
