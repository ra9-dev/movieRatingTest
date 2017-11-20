//require all dependencies
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	cors = require('cors'),
	axios = require('axios'),
	config = require('./config'),
	port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({	extended: true	}));
app.use(bodyParser.json());

var timout = config.timeout;
console.log(timout);
var defaultMsg = 'No Results Found !!';

app.route('/')
.post(async function(req, res){
	console.time('check');
	res.setTimeout(0);
	moviename = req.body.moviename;
	if(moviename == '') {
		var omdbData = defaultMsg;
		var tmdbData = defaultMsg;
	}
	else {
		var omdbData = await omdb(moviename);
		var tmdbData = await tmdb(moviename);
	}
	setTimeout(function() {
		res.json({
			omdb: omdbData,
			tmdb: tmdbData,
		});
		console.timeEnd('check');
	}, timout*60*1000);
});

var omdb = async function(title) {
	url = 'http://www.omdbapi.com/?t='+title+'&apikey=4f529e8a';
	console.log(url);
	try {
		const response = await axios.get(url);
		const data = response.data;
		if(data.Error)
			return defaultMsg;
		else {
			console.log(data);
			return data.imdbRating;
		}
	} catch (error) {
		console.log(error);
	}
};

var tmdb = async function(title) {
	url = 'https://api.themoviedb.org/3/search/movie?api_key=3bc1b44eaf4ad04450605fce22470ebf&query='+title+'&page=1';
	console.log(url);
	try {
		const response = await axios.get(url);
		const data = response.data;
		if(data.total_results == 0)
			return defaultMsg;
		else {
			console.log(data.results[0]);
			return data.results[0].vote_average;
		}
	} catch (error) {
		console.log(error);
	}
};

//start server at 3000 port
app.listen(port);
console.log('Server started at port: '+port);