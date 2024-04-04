// backend/server.js
require('dotenv').config();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const { format } = require("date-fns");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
  })
);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to MySQL");
});

app.get("/", (req, res) => {
  if (req.session.firstname) {
    return res.json({
      valid: true,
      username: req.session.firstname,
      id: req.session.user_id,
    });
  } else {
    return res.json({ valid: false });
  }
});

app.get("/api/events", (req, res) => {
  const sql = "SELECT * FROM events";
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send({ error: "Error fetching events" });
      return;
    }
    res.send(result);
  });
});

app.get("/api/events/:id", (req, res) => {
  const eventId = req.params.id;
  const sql = `
    SELECT e.*, en.name AS entrepreneur_name
    FROM events e
    LEFT JOIN entrepreneurs en ON e.entrepreneur_id = en.id
    WHERE e.id = ?`;
  db.query(sql, [eventId], (err, result) => {
    if (err) {
      res.status(500).send({ error: "Error fetching event details" });
      return;
    }
    if (result.length === 0) {
      res.status(404).send({ error: "Event not found" });
      return;
    }
    res.send(result[0]);
  });
});

app.get("/api/events2/:id", (req, res) => {
  const eventId = req.params.id; // Récupérer uniquement l'ID de l'événement depuis les paramètres de l'URL
  res.send({ eventId }); // Envoyer l'ID de l'événement en tant que réponse
});

app.get("/api/event/:id/entrepreneurs", (req, res) => {
  const eventId = req.params.id;

  // Récupérer les ID des entrepreneurs associés à l'événement
  const sqlGetEntrepreneurIds =
    "SELECT entrepreneur_id FROM event_entrepreneur WHERE event_id = ?";
  db.query(sqlGetEntrepreneurIds, [eventId], (err, entrepreneurIdsResult) => {
    if (err) {
      console.error("Error fetching entrepreneur IDs:", err);
      res.status(500).send({ error: "Error fetching entrepreneur IDs" });
      return;
    }

    // Extraire les ID des entrepreneurs de la réponse
    const entrepreneurIds = entrepreneurIdsResult.map(
      (row) => row.entrepreneur_id
    );

    // Récupérer les noms des entrepreneurs associés aux ID récupérés
    const sqlGetEntrepreneurNames =
      "SELECT name FROM entrepreneurs WHERE id IN (?)";
    db.query(
      sqlGetEntrepreneurNames,
      [entrepreneurIds],
      (err, entrepreneurNamesResult) => {
        if (err) {
          console.error("Error fetching entrepreneur names:", err);
          res.status(500).send({ error: "Error fetching entrepreneur names" });
          return;
        }

        // Extraire les noms des entrepreneurs de la réponse
        const entrepreneurNames = entrepreneurNamesResult.map(
          (row) => row.name
        );

        // Envoyer les noms des entrepreneurs en tant que réponse
        res.send({ entrepreneurs: entrepreneurNames });
      }
    );
  });
});

// Route pour récupérer les orateurs associés à un événement spécifique
app.get("/api/event/:id/speakers", (req, res) => {
  const eventId = req.params.id;

  // Récupérer les ID des orateurs associés à l'événement
  const sqlGetSpeakerIds =
    "SELECT speaker_id FROM event_speaker WHERE event_id = ?";
  db.query(sqlGetSpeakerIds, [eventId], (err, speakerIdsResult) => {
    if (err) {
      console.error("Error fetching speaker IDs:", err);
      res.status(500).send({ error: "Error fetching speaker IDs" });
      return;
    }

    // Extraire les ID des orateurs de la réponse
    const speakerIds = speakerIdsResult.map((row) => row.speaker_id);

    // Récupérer les noms des orateurs associés aux ID récupérés
    const sqlGetSpeakerNames = "SELECT name FROM speakers WHERE id IN (?)";
    db.query(sqlGetSpeakerNames, [speakerIds], (err, speakerNamesResult) => {
      if (err) {
        console.error("Error fetching speaker names:", err);
        res.status(500).send({ error: "Error fetching speaker names" });
        return;
      }

      // Extraire les noms des orateurs de la réponse
      const speakerNames = speakerNamesResult.map((row) => row.name);

      // Envoyer les noms des orateurs en tant que réponse
      res.send({ speakers: speakerNames });
    });
  });
});

app.get("/api/event/:id/partners", (req, res) => {
  const eventId = req.params.id;

  // Récupérer les ID des partenaires associés à l'événement
  const sqlGetPartnerIds =
    "SELECT partner_id FROM event_partner WHERE event_id = ?";
  db.query(sqlGetPartnerIds, [eventId], (err, partnerIdsResult) => {
    if (err) {
      console.error("Error fetching partner IDs:", err);
      res.status(500).send({ error: "Error fetching partner IDs" });
      return;
    }

    // Extraire les ID des partenaires de la réponse
    const partnerIds = partnerIdsResult.map((row) => row.partner_id);

    
    const sqlGetPartnerNames = "SELECT name FROM partners WHERE id IN (?)";
    db.query(sqlGetPartnerNames, [partnerIds], (err, partnerNamesResult) => {
      if (err) {
        console.error("Error fetching partner names:", err);
        res.status(500).send({ error: "Error fetching partner names" });
        return;
      }

      // Extraire les noms des partenaires de la réponse
      const partnerNames = partnerNamesResult.map((row) => row.name);

      
      res.send({ partners: partnerNames });
    });
  });
});


app.post("/api/events/:id/register", (req, res) => {
  const eventId = req.params.id; 
  console.log("Event ID:", eventId); 
  const { firstName, lastName, role } = req.body;

  
  const userId = req.session.user_id; 

  
  let price = 0;
  if (role === "speaker") {
    price = 30;
  } else if (role === "intervener") {
    price = 20;
  } else {
    price = 10;
  }

  
  const sql =
    "INSERT INTO event_registrations (event_id, user_id, firstName, lastName, role, registration_price, registration_date) VALUES (?, ?, ?, ?, ?, ?, NOW())";

  db.query(
    sql,
    [eventId, userId, firstName, lastName, role, price],
    (err, result) => {
      if (err) {
        console.error("Error registering for event:", err);
        res
          .status(500)
          .send({ success: false, message: "Erreur lors de l'inscription" });
        return;
      }
      res.send({ success: true, message: "Inscription réussie !", price });
    }
  );
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM users WHERE email = ?`;
  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      bcrypt.compare(password, data[0].password, (error, response) => {
        if (response) {
          req.session.firstname = data[0].firstname; 
          const userId = data[0].id;
          req.session.user_id = userId;
          console.log(req.session.firstname); 
          return res.json({ username: req.session.firstname });
        } else {
          return res.json("Invalid Email or Password");
        }
      });
    } else {
      return res.json("User doesn't exist");
    }
  });
});

app.post("/api/check-email", (req, res) => {
  const { email } = req.body;
  const sql = `SELECT COUNT(*) AS count FROM users WHERE email = ?`;
  db.query(sql, [email], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la vérification de l'email" });
    }
    const emailExists = result[0].count > 0;
    res.json({ exists: emailExists });
  });
});

app.post("/api/register", (req, res) => {
  const sql =
    "INSERT INTO users (`firstname`, `lastname`, `email`, `password`, `phone_number`) VALUES (?)";
  const values = [
    req.body.firstname,
    req.body.lastname,
    req.body.email,
    req.body.password,
    req.body.phone,
  ];
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) {
      return res.json({ error: "Erreur lors du cryptage du mot de passe" });
    }
    values[3] = hash;
    db.query(sql, [values], (err, result) => {
      if (err) {
        return res.json({
          error: "Erreur lors de l'enregistrement de l'utilisateur",
        });
      }
      res.json({ success: true });
    });
  });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur lors de la déconnexion :", err);
      return res.status(500).json({ error: "Erreur lors de la déconnexion" });
    }
    res.clearCookie("connect.sid"); 
    res.json({ success: true });
  });
});

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
