const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./userModel");
const app = express();
const cors = require("cors");
const port = 777;

app.use(express.json(), cors());

app.get('/', (req, res) => {
  res.send('App is working!')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

app.post("/login", async (req, res, next) => {
  let { email, password } = req.body;
  let existingUser;

  const user = new User()

  try {
    existingUser = await user.findOne(email);
  } catch {
    const error = new Error("Error! Something went wrong. While checking the user data.");
    return next(error);
  }

  if (!existingUser || existingUser.password != password) {
    res.status(403).json({
      success: false,
      message: "Wrong details, maybe you wrote your password in a book?"
    });
    return next();
  }

  let token;

  try {
    //Creating jwt token
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        roleId: existingUser.roleId
      },
      "secretKeyAppearsHere",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: {
      token: token,
    },
  });
});

app.post("/signup", async (req, res, next) => {
  const {
    email,
    password,
    firstName,
    lastName,
    roleId
  } = req.body;

  const newUser = new User(email, password, firstName, lastName, roleId);

  try {
    await newUser.save();
  } catch {
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }

  let token;

  try {
    token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        roleId: newUser.roleId
      },
      "secretKeyAppearsHere",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }

  res.status(201).json({
    success: true,
    data: {
      token: token
    },
  });
});

app.get('/accessResource', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  //Authorization: 'Bearer TOKEN'
  if (!token) {
    res.status(200).json({
      success: false,
      message: "Error!Token was not provided."
    });
  }

  //Decoding the token
  const decodedToken = jwt.verify(token, "secretKeyAppearsHere");

  res.status(200).json({
    success: true,
    data: {
      userId: decodedToken.userId,
      email: decodedToken.email,
      roleId: decodedToken.roleId
    }
  });
})