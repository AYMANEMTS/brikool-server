const express = require('express');
const http = require('http');
const routes = require('./routes/index')
const session = require("express-session");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorHandler');
const passport = require("passport");
const initializeSocket = require("./config/socket");
const connectDB = require("./config/dbConnection");
const i18next = require("i18next");
const i18nextBackend = require("i18next-fs-backend");
const i18nextMiddleware = require("i18next-http-middleware");
const path = require("path");


require('dotenv').config();

const app = express();

i18next
    .use(i18nextBackend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        fallbackLng: "en",
        backend: {
            loadPath: "./locales/{{lng}}/translation.json"
        }
    })
app.use(i18nextMiddleware.handle(i18next))

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: 'https://brikool-client.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(
    session({
      secret: "secret_session",
      resave: false,
      saveUninitialized: false,
    })
  );
app.use(cookieParser());
app.use(passport.initialize());

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

require("./config/oauth")(passport)

// Routes
app.use(routes)
app.use(errorHandler);
app.get('/translation', (req, res) => {
    const t = req.t
    res.json({message: t('test')
})
})



const server = http.createServer(app);

initializeSocket(server);
// i18nextConfig(app);
connectDB();

const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log('Server is running on port ' + port);
});
