const mongoose = require('mongoose');
require('./config/db');

const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const router = require('./routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const passport = require('./config/passport');

require('dotenv').config({ path: 'variables.env' });

const app = express();

// Habilitar body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Validación de campos con express Validator
app.use(expressValidator());

// Habilitar handlebars como view
app.engine('handlebars',
     exphbs({
          defaultLayout: 'layout',
          helpers: require('./helpers/handlebars')
     })
);
app.set('view engine', 'handlebars');

// static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(session({
     secret: process.env.SECRETO,
     key: process.env.KEY,
     resave: false,
     saveUninitialized: false,
     store: new MongoStore({ mongooseConnection: mongoose.connection})

}));

// inicializar passport
app.use(passport.initialize());
app.use(passport.session());

// Alertas y flash mensajes
app.use(flash());

// Crear nuevo middleware
app.use((req, res, next) => {
     res.locals.mensajes = req.flash();
     next();
});

app.use('/', router());

app.listen(process.env.PUERTO);