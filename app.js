const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const services = require("./key.json");
const { getFirestore } = require("firebase-admin/firestore");

admin.initializeApp({
  credential: admin.credential.cert(services),
});

const app = express();
const PORT = 3000;
const db = getFirestore();

app.use(bodyParser.json());
app.use(express.static("/public"));

app.set("view engine", "ejs");

app.get("/dashboard/:username", async (req, res) => {
  const username = req.params.username;
  const userRef = db.collection("users").doc(username);
  const doc = await userRef.get();
  if (!doc.exists) {
    return res.status(401).send({ message: "Invalid email or password." });
  }
  const userData = doc.data();
  res.render("index", { result: userData });
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public" + "/login.html");
});

app.post("/login", async function (req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ message: "All fields are required." });
  }
  try {
    const userRef = db.collection("users").doc(username);
    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(401).send({ message: "Invalid email or password." });
    }
    const userData = doc.data();
    if (userData.password === password) {
      res.status(200).send({ message: "Login successful." });
    } else {
      res.status(401).send({ message: "Invalid email or password." });
    }
  } catch (e) {
    console.error("Error during login:", e);
    res.status(500).send({ message: "Internal server error." });
  }
});
app.get("/signup", function (req, res) {
  res.sendFile(__dirname + "/public" + "/signup.html");
});
app.post("/signup", async function (req, res) {
  const { fullName, email, password, id } = req.body;
  if (!fullName || !email || !password || !id) {
    return res.status(400).send({ message: "All fields are required." });
  }
  const userId = id;
  try {
    const userRef = db.collection("users").doc(userId);

    await userRef.set({
      email: email,
      fullName: fullName,
      password: password,
      userId: id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).send({ message: "User created successfully", uid: userId });
  } catch (error) {
    console.error("Error creating new user:", error);
    res.status(400).send({ message: error.message });
  }
});
app.listen(PORT, function () {
  console.log(`Server is running on http://localhost:${PORT}`);
});
