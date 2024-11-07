import express from 'express';
import googleAuth from './auth/google.js';
import createRecipe from './recipe/create.js';
import deleteRecipe from './recipe/delete.js';
import getRecipe from './recipe/get.js';
import searchRecipe from './recipe/search.js';
import createTag from './tag/create.js';
import searchTag from './tag/search.js';
import deleteUser from './user/delete.js';
import getUser from './user/get.js';
import login from './user/login.js';
import signup from './user/signup.js';
import updateUser from './user/update.js';
import verifyEmail from './user/verifyemail.js';

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/api/auth/google', googleAuth);
app.use('/api/recipe/create', createRecipe);
app.use('/api/recipe/delete', deleteRecipe);
app.use('/api/recipe/get', getRecipe);
app.use('/api/recipe/search', searchRecipe);
app.use('/api/tag/create', createTag);
app.use('/api/tag/search', searchTag);
app.use('/api/user/delete', deleteUser);
app.use('/api/user/get', getUser);
app.use('/api/user/login', login);
app.use('/api/user/signup', signup);
app.use('/api/user/update', updateUser);
app.use('/api/user/verifyemail', verifyEmail);

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
