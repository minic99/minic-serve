const express = require('express');
const bodyParser = require('body-parser');
const SubmitVerifier = require('submit-verifier');
const AbstractRepository = require('./AbstractRepository');

const app = express();
const port = 3000;

// Use body-parser middleware to parse request bodies
app.use(bodyParser.json());

// Simulated database
const userRepository = new AbstractRepository('users.db');

// Create a new instance of SubmitVerifier
const verifier = SubmitVerifier.create();

// Middleware function to validate user data
function validateUserData(req, res, next) {
  const user = req.body;
  const isValid = verifier.verifySubmission(user);
  if (!isValid) {
    return res.status(400).send('Invalid user data');
  }
  next();
}

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await userRepository.getAll();
    res.json(allUsers);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Create a new user
app.post('/api/users', validateUserData, async (req, res) => {
  const newUser = req.body;
  try {
    const createdUser = await userRepository.create(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Get a specific user
app.get('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userRepository.getById(userId);
    if (!user) {
      res.status(404).send('User not found');
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Update a specific user
app.put('/api/users/:id', validateUserData, async (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;
  try {
    const user = await userRepository.update(userId, updatedUser);
    res.json(user);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Delete a specific user
app.delete('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await userRepository.delete(userId);
    res.json(deletedUser);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
