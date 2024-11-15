import express from 'express';
import cors from 'cors';
import googleAuth from './auth/google.js';
import createRecipe from './recipe/create.js';
import deleteRecipe from './recipe/delete.js';
import getRecipe from './recipe/get.js';
import searchRecipe from './recipe/search.js';
import updateRecipe from './recipe/update.js';
import createTag from './tag/create.js';
import searchTag from './tag/search.js';
import deleteUser from './user/delete.js';
import getUser from './user/get.js';
import login from './user/login.js';
import signup from './user/signup.js';
import updateUser from './user/update.js';
import verifyEmail from './user/verifyemail.js';
import passwordReset from './user/passwordReset.js'

const app = express();

app.use(express.json());

const corsOptions = {
  origin: ['http://localhost:5173', 'http://nomnom.network'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};


app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// app.options('', (req, res) => {
//   res.setHeader('Access-Control-Allow-Origin', ''); // Allow all origins
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.sendStatus(200); // Respond with HTTP 200 OK
// });

app.use('/api/auth/google', googleAuth);
app.use('/api/recipe/create', createRecipe);
app.use('/api/recipe/delete', deleteRecipe);
app.use('/api/recipe/get', getRecipe);
app.use('/api/recipe/search', searchRecipe);
app.use('/api/recipe/update', updateRecipe);
app.use('/api/tag/create', createTag);
app.use('/api/tag/search', searchTag);
app.use('/api/user/delete', deleteUser);
app.use('/api/user/get', getUser);
app.use('/api/user/login', login);
app.use('/api/user/signup', signup);
app.use('/api/user/update', updateUser);
app.use('/api/user/verifyemail', verifyEmail);
app.use('/api/user/passwordreset', passwordReset)

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.VITE_SERVER_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
