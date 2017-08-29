Array.prototype.forEach2= function(a){
let l=this.length;
for(let i=0;i<l;i++) {
a(this[i]);
}
return undefined
};

let keys = require("./keys.js");
let fs = require("fs");
let request = require("request");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var spotify = new Spotify(keys.spotifyKeys);
var twitter	= new Twitter(keys.twitterKeys);
let command = process.argv[2];
let inputToEvaluate = process.argv.slice(3).join(" ");
fs.appendFile("log.txt",command +":"+inputToEvaluate+"$",function(err){if(err){console.log(err)}});
if(command === "do-what-it-says"){
		let commandAndInput = fs.readFileSync('random.txt', 'utf8').split(",");
		command = commandAndInput[0];
		inputToEvaluate = commandAndInput[1];
}



 
function spotifySearch(songBeingSearched){

	if(!songBeingSearched){
	songBeingSearched = `The Sign Ace of Base`;
	}
 
spotify.search({ type: 'track', query: songBeingSearched}, function(err, data) {
  if (err) {
    console.log('Error occurred: ' + err);
  }
  let song = "song is: "+data.tracks.items[0].name;
  let artists = "artist(s): "+data.tracks.items[0].artists.map(function(artistForRound){return artistForRound.name}).join(" ");
  let album =  data.tracks.items[0].album.type +": "+ data.tracks.items[0].album.name;
  let link =   "link: "+data.tracks.items[0].external_urls.spotify;
	console.log([song,artists,album,link].join("\n"));

});
};

function twitterSearch(){
		twitter.get('statuses/user_timeline',function(error,tweets,response) 
		{
			if(error)
			{
				console.log("error is "+ error);
			}

			console.log(tweets.map(function(x){return x.created_at + "\n"+ x.text}).join("\n"));

	  	});
};
	function movieSearch(inputToEvaluate2)
{
	if(!inputToEvaluate2){
		inputToEvaluate2 = `mr.nobody,`;
	}
	console.log(inputToEvaluate2);
	request('http://www.omdbapi.com/?t='+inputToEvaluate2.replace(" ","+")+'&y=&plot=short&apikey=40e9cece', function (error, response, body) 
	{
		let res = JSON.parse(body);
	  	let info = 
	  	{
	      Title: "Title: "+res.Title,
	      Year: "Year: "+res.Year,
	      'Imdb': "Imdb: " + res.Ratings[0].Value || 'N/A',
	      'Rotten Tomatoes': "Rotten Tomatoes: "+ res.Ratings[1].Value || 'N/A',
	      Country: "Country: "+res.Country,
	      Language: "Language: "+res.Language,
	      Actors: "Actors: \n"+res.Actors.split(', ').join("\n")
	    };
	    for(key in info)
		    {
		    	console.log(info[key]);
		    }
  	});
};

switch(command){

	case 'my-tweets':
		twitterSearch();
		break;

	case 'spotify-this-song':
		spotifySearch(inputToEvaluate);
		break;

	case 'movie-this':
		movieSearch(inputToEvaluate);
		break;
	default:
		console.log("error: invalid input\n four options can be found below.\n1)my-tweets\n2)spotify-this-song\n3)movie-this\n4)do-what-it-says");
}



//http://www.omdbapi.com/?t=mission+impossible&y=&plot=short&apikey=40e9cece