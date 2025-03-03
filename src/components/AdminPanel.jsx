import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Box, Typography, List, ListItem, Paper } from '@mui/material';
import { db } from '../firebase';

export default function AdminPanel() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'activities'), (snapshot) => {
      const allQuestions = snapshot.docs.flatMap(doc => 
        Object.entries(doc.data().questions || {}).map(([userId, text]) => ({
          activityId: doc.id,
          userId,
          text,
          activityTitle: doc.data().title
        }))
      );
      setQuestions(allQuestions);
    });
    return unsubscribe;
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>User Questions</Typography>
        <List>
          {questions.map((q, index) => (
            <ListItem key={index} divider>
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1">Activity: {q.activityTitle}</Typography>
                <Typography variant="body2">User ID: {q.userId}</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>Q: {q.text}</Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
