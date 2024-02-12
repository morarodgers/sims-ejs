const express = require("express");
require("express-async-errors");
require("dotenv").config(); // to load the .env file into the process.env object
const connectDB = require("./db/connect");
const app = express();
const session = require("express-session");
const secretWordRouter = require("./routes/secretWord");
const auth = require("./middleware/auth");
const studentsRouter = require("./routes/students");
const cookieParser = require("cookie-parser");
const csrf = require("host-csrf");

const MongoDBStore = require("connect-mongodb-session")(session);
const url = process.env.MONGO_URI;

const store = new MongoDBStore({
  uri: url,
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log(error);
});

const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sessionParms.cookie.secure = true;
}

app.use(express.static('views'));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(session(sessionParms));

let csrf_development_mode = true;
if (app.get("env") === "production") {
  csrf_development_mode = false;
  app.set("trust proxy", 1);
}

const csrf_options = {
  protected_operations: ["POST", "PATCH", "PUT"],
  protected_content_types: ["application/x-www-form-urlencoded", "application/json"],
  development_mode: csrf_development_mode,
  header_name: "csrf-token",
};

app.use(csrf(csrf_options));

const passport = require("passport");
const passportInit = require("./passport/passportInit");

passportInit();
app.use(passport.initialize());
app.use(passport.session());

app.use(require("connect-flash")());
app.use(require("./middleware/storeLocals"));
app.get("/", (req, res) => {
  res.render("index");
});
app.use("/sessions", require("./routes/sessionRoutes"));
app.use("/students", auth, studentsRouter);
app.use("/secretWord", auth, secretWordRouter);

app.set("view engine", "ejs");

app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();