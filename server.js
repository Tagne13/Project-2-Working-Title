const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const routes = require("./controllers");
const ifetch = require("isomorphic-fetch");

// Import db connection
const sequelize = require("./config/connection");

// SQL session store
const SequelizeStore = require("connect-session-sequelize")(session.Store);

// Create express server
const app = express();

// Define PORT for deployment
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create();

// Set up session and connect to Sequelize db
const sess = {
  secret: "Super secret secret",
  cookie: {
    maxAge: 15 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Inform Express.js which template engine to use
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (import CSS file)
app.use(express.static(path.join(__dirname, "public")));

// Connect to routes in controller folder
app.use(routes);
app.get("/retrieve-album", (req, res) => {
  const apiURL = `https://api.deezer.com/search/album?q=${req.query.albumName}`;
  ifetch(apiURL)
    .then((response) => response.json())
    .then((albumData) => res.send(albumData));
});

app.get("/retrieve-albumById", (req, res) => {
  const apiURL = `https://api.deezer.com/album/${req.query.albumid}`;
  ifetch(apiURL)
    .then((response) => response.json())
    .then((albumData) => res.send(albumData));
});

// Sync sequelize models to db; turn on server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () =>
    console.log(`Now listening at http://localhost:${PORT}`)
  );
});
