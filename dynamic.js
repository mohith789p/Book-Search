// Import the required libraries
const express = require("express");

// Create an instance of an Express application
const app = express();

const PORT = process.env.PORT || 3000;

// Sample user data
const users = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
];

// Dynamic route to get user information by ID
app.get("/user/:id", (req, res) => {
  const userId = req.params.id; // Access the dynamic parameter
  const user = users.find((u) => u.id === userId); // Retrieve user from the array

  if (user) {
    res.status(200).json(user); // Send user data back as JSON
  } else {
    res.status(404).send({ message: "User not found" }); // Handle user not found scenario
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
