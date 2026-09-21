import express from 'express';
import session from 'express-session';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import router from './src/routes.js';
import flash from './src/middleware/flash.js';

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

// Get the session secret from environment variables
const SESSION_SECRET = process.env.SESSION_SECRET;

// Make sure SESSION_SECRET is available
if (!SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
}

// Get the current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the Express application
const app = express();

/**
 * Trust Render's reverse proxy in production.
 *
 * Render handles HTTPS before forwarding requests to the Express
 * application. Trusting the proxy allows Express to correctly
 * recognize secure HTTPS requests when using secure cookies.
 */
if (NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

/**
 * Make common variables available to all EJS templates.
 */
app.use((req, res, next) => {
    res.locals.currentPath = req.path || '/';
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

/**
 * Configure express-session middleware.
 *
 * Sessions are required for flash messages because flash messages
 * must survive the redirect from one request to another.
 */
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
    })
);

/**
 * Flash messages middleware.
 *
 * This must run after express-session because flash messages
 * are stored inside the user's session.
 */
app.use(flash);

/**
 * Configure Express middleware.
 */

// Allow Express to receive and process form data
app.use(express.urlencoded({ extended: true }));

// Allow Express to receive and process JSON data
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find the templates
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Middleware to log incoming requests.
 */
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }

    next();
});

/**
 * Use the imported router to handle routes.
 */
app.use(router);

/**
 * Catch-all route for 404 errors.
 */
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

/**
 * Global error handler.
 */
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);

    // Make sure these variables are available to the error page
    res.locals.currentPath = req.path || '/';
    res.locals.NODE_ENV = NODE_ENV;

    const status = err.status || 500;

    const template = status === 404 ? '404' : '500';

    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack,
    };

    res.status(status).render(`errors/${template}`, context);
});

/**
 * Start the server.
 *
 * Render provides the PORT environment variable.
 * 0.0.0.0 allows Render to access the application.
 */
app.listen(PORT, '0.0.0.0', async () => {
    try {
        await testConnection();

        console.log(`Server is running at http://localhost:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});