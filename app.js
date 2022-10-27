const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const JSONdb = require("simple-json-db");
const db = new JSONdb("./storage.json");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "saveleyub@gmail.com",
    pass: "uafohpjmrqoonvwe",
  },
});
const port = 3001;

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/oneTimePassword", async (req, res) => {
  const email = req.body.email;
  let counter = db.get("counter");
  const password = `password300${counter}`;

  const mailOptions = {
    from: "saveleyub@gmail.com",
    to: email,
    subject: "Нэг удаагийн нууц үг",
    text:`Таны нэг удаагийн нууц үг бол: ${password}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("error in sendEmail");
      return console.log(error.message);
    }
    db.set(email, {email, password});
    counter++;
    db.set("counter", counter);
    res.status(200).send({ message: "send" });
  });
});

app.post('/login' , async (req, res) => {
  const {email, password} = req.body;
  if (db.has(email)) {
    const realPassword = db.get(email).password;
    if (realPassword === password) {
      res.send('user');
    }
  }

  res.send('not user');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
