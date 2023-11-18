const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const Router = express.Router;

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

const router = Router();

const allowedOrigins = [
  "http://localhost:5173",
  "https://yourfrontenddomain.com",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Cors
app.use(cors(allowedOrigins));
// app.use(cors(corsOptions));

// Set the view engine to render HTML
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Api index
router.get("/", (req, res) => {
  res.render("index");
});

// Express route for sending emails
router.post("/send-email", (req, res) => {
  const { name, email, message } = req.body;

  var transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "familytree733@gmail.com",
      pass: "uhdfhzhuqqioglvw",
    },
  });

  const mailOptions = {
    from: "familytree733@gmail.com", // Sender address
    to: email, // List of recipients
    subject:
      "You have received a message from " + name + " via your portfolio site", // Subject line
    html: `<div style='display: flex; flex-direction: column;'>
    <p>${message}</p>
    </div>`, // Plain text body
  };
  transport.sendMail(mailOptions, async function (err, info) {
    if (err) {
      console.log(err);
      return res
        .status(400)
        .json({ msg: "Couldnt send email. Please try again", isError: true });
    } else {
      return res
        .status(200)
        .json({ msg: "Email sent successfully!", isError: false });
    }
  });
});

app.use("/api", router);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
