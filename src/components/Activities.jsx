import { useEffect, useState } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { Checkbox, Button, TextField, Typography, Box } from '@mui/material';
import { db } from '../firebase';

export default function Activity({ activity, userId, isAdmin }) {
  const [question, setQuestion] = useState('');
  const [status, setStatus] = useState(activity.status);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'activities', activity.id), (doc) => {
      setQuestion(doc.data().questions?.[userId] || '');
      setStatus(doc.data().status);
    });
    return unsubscribe;
  }, [activity.id, userId]);

  const handleStatusChange = async () => {
    const newStatus = status === 'Not Started' ? 'Finished' : 'Not Started';
    await setDoc(doc(db, 'activities', activity.id), { status: newStatus }, { merge: true });
  };

  const handleQuestionChange = async (e) => {
    await setDoc(doc(db, 'activities', activity.id), {
      questions: { [userId]: e.target.value }
    }, { merge: true });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {isAdmin && <Checkbox checked={status === 'Finished'} />}
        <Typography variant="h6">{activity.title}</Typography>
        <Button 
          variant="contained" 
          color={status === 'Finished' ? 'success' : 'primary'}
          onClick={handleStatusChange}
        >
          {status}
        </Button>
      </Box>
      <TextField
        fullWidth
        label="Your Question"
        value={question}
        onChange={handleQuestionChange}
        variant="outlined"
        sx={{ mt: 1 }}
      />
    </Box>
  );
}
