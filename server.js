const express = require('express');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const sql = require("sqlite3").verbose();

const LostFoundDB = new sql.Database("LostFound.db");
const FormData = require("form-data");

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const assets = require('./assets');
const app = express();


app.use(express.static(path.join('build')));
app.use(cookieParser());

let cmd = " SELECT name FROM sqlite_master WHERE type='table' AND name='LostFoundTable' ";
LostFoundDB.get(cmd, function (err, val) {
    console.log(err, val);
    if (val == undefined) {
        console.log("No database file - creating one");
        createDB();
    } else {
        console.log("Database file found");
    }
});

function createDB() {
    // explicitly declaring the rowIdNum protects rowids from changing if the
    // table is compacted; not an issue here, but good practice
    const cmd = 'CREATE TABLE LostFoundTable ( rowIdNum INTEGER PRIMARY KEY, type TEXT,title TEXT, category TEXT, description TEXT, photoURL TEXT, time DATETIME, location TEXT)';
    LostFoundDB.run(cmd, function(err, val) {
        if (err) {
            console.log("Database creation failure",err.message);
        } else {
            console.log("Created database");
        }
    });
}

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname+'/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
// let upload = multer({dest: __dirname+"/assets"});
let upload = multer({storage: storage});

function handleSearch(request, response, next) {
    console.log(request.query);
    let type = request.query.type;
    let category = request.query.category;
    let location = request.query.location;
    let begin = request.query.begin_time;
    let end = request.query.end_time;
    let query_text = request.query.query_text;

    if(!begin)begin = "1000-01-01 00:00:00";
    if(!end)end = "9999-12-31 23:59:59"
    let cmd = "SELECT * FROM LostFoundTable where type = "+"'"+type+"'";
    if(category)cmd = cmd + " AND category = " +"'" +category+"'";
    cmd = cmd + "AND time between "+"'"+begin+"'"+" and "+"'"+end+"'";
    if(query_text)cmd = cmd + " AND (LOWER(description) LIKE LOWER('%" + query_text + "%') OR LOWER(title) LIKE LOWER('%"+query_text+"%'))";

    LostFoundDB.all(cmd, function (err, rows) {
        if (err) {
            console.log("Database reading error", err.message)
            next();
        } else {
            // send shopping list to browser in HTTP response body as JSON
            response.json(rows);
            //console.log("rows",rows);
        }
    });
}


app.use(bodyParser.json());
app.get('/search',handleSearch);

app.use("/images",express.static('images'));


// Handle a post request to upload an image.
app.post('/upload', upload.single('newImage'), function (request, response) {
    console.log("Recieved",request.file.originalname,request.file.size,"bytes")
    if(request.file) {
        // file is automatically stored in /images,
        // even though we can't see it.
        // We set this up when configuring multer
        sendMediaStore("/images/"+request.file.originalname,request,response);
        //let path = "images/"+request.file.originalname;


    }
    else throw 'error';
});

// The body-parser is used on requests with application/json in header
// parses the JSON in the HTTP request body, and puts the resulting object
// into request.body
app.use(bodyParser.json());
// Now that we have the body, handle the POST request
// The anonymous function is a middleware function
app.post("/post", function(request, response, next) {
    console.log("Server recieved",request.body);
    let type = request.body.type;
    let title = request.body.title;
    let category = request.body.category;
    let description = request.body.description;
    let photoURL = request.body.photoURL;

    let time = request.body.time;
    let location = request.body.location;
    console.log("new title:",title);
    console.log("location: ",location);
    // put new item into database
    cmd = "INSERT INTO LostFoundTable ( type, title, category, description, photoURL, time, location) VALUES (?,?,?,?,?,?,?) ";
    LostFoundDB.run(cmd,type,title,category,description,photoURL,time,location, function(err) {
        if (err) {
            console.log("DB insert error",err.message);
            next();
        } else {
            let newId = this.lastID; // the rowid of last inserted item
            response.status(200);
            response.send("Got new item, inserted with rowID: "+newId);
        }
    }); // callback, shopDB.run
}); // callback, app.post

function sendMediaStore(filename, serverRequest, serverResponse) {
    let apiKey = "0nj1xdfyo0";
    if (apiKey === undefined) {
        serverResponse.status(400);
        serverResponse.send("No API key provided");
    } else {
        // we'll send the image from the server in a FormData object
        let form = new FormData();

        // we can stick other stuff in there too, like the apiKey
        form.append("apiKey", apiKey);
        // stick the image into the formdata object
        form.append("storeImage", fs.createReadStream(__dirname + filename));
        // and send it off to this URL
        form.submit("http://ecs162.org:3000/fileUploadToAPI", function(err, APIres) {
            // did we get a response from the API server at all?
            if (APIres) {
                // OK we did
                console.log("API response status", APIres.statusCode);
                // the body arrives in chunks - how gruesome!
                // this is the kind stream handling that the body-parser
                // module handles for us in Express.
                let body = "";
                APIres.on("data", chunk => {
                    body += chunk;
                });
                APIres.on("end", () => {
                    // now we have the whole body
                    if (APIres.statusCode != 200) {
                        serverResponse.status(400); // bad request
                        serverResponse.send(" Media server says: " + body);
                    } else {
                        serverResponse.status(200);
                        serverResponse.send(body);
                    }
                });
            } else { // didn't get APIres at all
                serverResponse.status(500); // internal server error
                serverResponse.send("Media server seems to be down.");
            }
        });
    }
}


// Setup passport, passing it information about what we want to do
passport.use(new GoogleStrategy(
    // object containing data to be sent to Google to kick off the login process
    // the process.env values come from the key.env file of your app
    // They won't be found unless you have put in a client ID and secret for
    // the project you set up at Google
    {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        // CHANGE THE FOLLOWING LINE TO USE THE NAME OF YOUR APP
        callbackURL: 'https://lost-found-162.glitch.me/auth/accepted',
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo', // where to go for info
        scope: ['profile']  // the information we will ask for from Google
    },
    // function to call to once login is accomplished, to get info about user from Google;
    // it is defined down below.
    gotProfile));

// take HTTP message body and put it as a string into req.body
app.use(bodyParser.urlencoded({extended: true}));

// puts cookies into req.cookies
app.use(cookieParser());

// Now some stages that decrypt and use cookies

// express handles decryption of cooikes, storage of data about the session,
// and deletes cookies when they expire
app.use(expressSession(
    {
        secret:'bananaBread',  // a random string used for encryption of cookies
        maxAge: 6 * 60 * 60 * 1000, // Cookie time out - six hours in milliseconds
        // setting these to default values to prevent warning messages
        resave: true,
        saveUninitialized: false,
        // make a named session cookie; makes one called "connect.sid" as well
        name: "ecs162-session-cookie"
    }));

// Initializes request object for further handling by passport
app.use(passport.initialize());

// If there is a valid cookie, will call passport.deserializeUser()
// which is defined below.  We can use this to get user data out of
// a user database table, if we make one.
// Does nothing if there is no cookie
app.use(passport.session());


// Glitch assests directory
app.use("/assets", assets);

// stage to serve files from /user, only works if user in logged in

// If user data is populated (by deserializeUser) and the
// session cookie is present, get files out
// of /user using a static server.
// Otherwise, user is redirected to public splash page (/index) by
// requireLogin (defined below)
app.get('/src/*', requireUser, requireLogin, express.static('.'));

app.get('/auth/google', passport.authenticate('google'));

app.get('/auth/accepted',
    passport.authenticate('google',
        { successRedirect: '/setcookie', failureRedirect: '/' }
    )
);


app.post('/setcookie', requireUser,
    function(req, res) {
        // if(req.get('Referrer') && req.get('Referrer').indexOf("google.com")!=-1){
        // mark the birth of this cookie

        // set a public cookie; the session cookie was already set by Passport
        res.cookie('google-passport-example', new Date());
        res.redirect('/user/hello.html');
        //} else {
        //   res.redirect('/');
        //}
    }
);


// currently not used
// using this route, we can clear the cookie and close the session
app.get('/user/logoff',
    function(req, res) {
        // clear both the public and the named session cookie
        res.clearCookie('google-passport-example');
        res.clearCookie('ecs162-session-cookie');
        res.redirect('/');
    }
);


// function that handles response from Google containint the profiles information.
// It is called by Passport after the second time passport.authenticate
// is called (in /auth/accepted/)
function gotProfile(accessToken, refreshToken, profile, done) {
    console.log("Google profile",profile);
    // here is a good place to check if user is in DB,
    // and to store him in DB if not already there.
    // Second arg to "done" will be passed into serializeUser,
    // should be key to get user out of database.

    let dbRowID = 1;  // temporary! Should be the real unique
    // key for db Row for this user in DB table.
    // Note: cannot be zero, has to be something that evaluates to
    // True.

    done(null, dbRowID);
}


// Part of Server's sesssion set-up.
// The second operand of "done" becomes the input to deserializeUser
// on every subsequent HTTP request with this session's cookie.
// For instance, if there was some specific profile information, or
// some user history with this Website we pull out of the user table
// using dbRowID.  But for now we'll just pass out the dbRowID itself.
passport.serializeUser((dbRowID, done) => {
    console.log("SerializeUser. Input is",dbRowID);
    done(null, dbRowID);
});

// Called by passport.session pipeline stage on every HTTP request with
// a current session cookie (so, while user is logged in)
// This time,
// whatever we pass in the "done" callback goes into the req.user property
// and can be grabbed from there by other middleware functions
passport.deserializeUser((dbRowID, done) => {
    console.log("deserializeUser. Input is:", dbRowID);
    // here is a good place to look up user data in database using
    // dbRowID. Put whatever you want into an object. It ends up
    // as the property "user" of the "req" object.
    let userData = {userData: "maybe data from db row goes here"};
    done(null, userData);
});

function requireUser (req, res, next) {
    console.log("require user",req.body)
    if (!req.body.user) {
        res.redirect('/');
    } else {
        console.log("user is",req.user);
        next();
    }
}

function requireLogin (req, res, next) {
    console.log("checking:",req.cookies);
    if (!req.cookies['ecs162-session-cookie']) {
        res.redirect('/');
    } else {
        next();
    }
}


app.get('/*', function (req, res) {
    res.sendFile(__dirname + "/build/index.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
    console.log("Your app is listening on port " + listener.address().port);
});