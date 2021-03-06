var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// available routes
var index = require('./routes/index');
var tickets = require('./routes/tickets');
var pro = require('./routes/proVersion');
var friends = require('./routes/friends');
var adBanner = require('./routes/adBanner');

// framwork so that the backend can work properly
var cors = require('cors');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

// routes mapping
app.use('/api', index);
app.use('/api/tickets', tickets);
app.use('/api/pro_version', pro);
app.use('/api/friends', friends);
app.use('/api/ad_banner', adBanner);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.json({ 'message': err.message });
});

module.exports = app;