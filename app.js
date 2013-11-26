/**
 * Module dependencies.
 */
var express = require('express')
    , app = express()
    , Validator = require('validator').Validator
    ;
var routes = require('./routes');
var http = require('http');
var path = require('path');
var fs = require('fs');
var csv = require("fast-csv");


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade' );
app.use(express.cookieParser());
app.use(express.session({ secret: 'radioactive chimps drowning' }));
app.use(express.bodyParser( { keepExtensions: true, uploadDir: "public/uploads" } ));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.csrf());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    //app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    //app.locals.pretty = true;
}

if ('production' == app.get('env')) {
    app.use(express.errorHandler());
}
app.locals.errors = {};
app.locals.message = {};

function validate(message) {

    var v = new Validator(), errors = [];

    v.error = function(msg) {
        errors.push(msg);
    };

    v.check(message.organization, 'Please enter your Organization Name').len(1, 100);
    v.check(message.application, 'Please enter your Application Name').len(1, 100);
    v.check(message.collection, 'Please enter the name of the Collection').len(1, 100);
    v.check(message.username, 'Please enter a valid username').len(4, 32);
    v.check(message.password, 'Please enter a valid password').len(4, 64);

    return errors;
}

function csrf(req, res, next) {
    res.locals.token = req.session._csrfSecret;
    next();
}

app.get('/contact', function(req, res) {
    res.render('contact');
});

app.get('/about', function(req, res) {
    res.render('about');
});

app.get('/', csrf, function(req, res) {
    res.render('index');
});

app.post('/csvupload', csrf, function(req, res) {

    var message = req.body.message
        , errors = validate(message)
        , locals = {}
        ;

    function render() {
        res.render('index', locals);
    }

    // Log the file name and file path
    console.log("file name", req.files.csvfile.name);
    console.log("file path", req.files.csvfile.path);

    // get the temporary location of the file
    var tmp_path = req.files.csvfile.path;
    var data = {};
    var csvdata = "["; // The Editor needs the data to be an array
    var i =1;

    var stream = fs.createReadStream( tmp_path );

    csv(stream, {headers : true, ignoreEmpty: true})
        .on("data", function(data){
            // Add to the upload data array of converted CSV data
            var temp = JSON.stringify(data) + ",";
            csvdata += temp;
            i++;
        })
        .on("end", function(data){
            // Change the comma to an end array bracket to pass lint in the editor
            if (csvdata.substr(csvdata.length - 1, 1) == ',') {
                csvdata = csvdata.substr(0, csvdata.length - 1) + ']';
            }
            // Render the page with all input parameters for validation or correction before
            // attempting an upload.
            res.render ( 'display' , {organization: message.organization,
                                      application: message.application,
                                      collection: message.collection,
                                      username: message.username,
                                      password: message.password,
                                      stuff : csvdata });
            fs.unlink(tmp_path, function(err) {
                if (err) throw err;
            });
        })
        .parse();

    if (errors.length > 0) {
        locals.error = 'Your CSV File has errors:';
        locals.errors = errors;
        locals.message = message;
        render();
    }
});

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});