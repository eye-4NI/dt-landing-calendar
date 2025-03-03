const express = require('express');
const { google } = require('googleapis');
const session = require('express-session');
require('dotenv').config();

const app = express();
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

// Configure OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://your-cloudshell-url/oauth/callback' // Update with your URL
);

// Step 1: Generate OAuth URL
app.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['email', 'profile'],
    state: req.sessionID
  });
  res.redirect(url);
});

// Step 2: Handle OAuth Callback
app.get('/oauth/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    // Store tokens in session
    req.session.tokens = tokens;
    
    // Redirect to frontend
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Authentication failed');
  }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
