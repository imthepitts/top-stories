var express = require('express');
var router = express.Router();
var restify = require('restify');

/* GET stories */
router.get('/', function(req, res, next) {

    var stories = [],
        items = 0,

        start = function(){
            getNytStories();
        },

        getNytStories = function() {
            console.log('Getting NYT Stories');
            var client = restify.createJsonClient({
                url: 'http://api.nytimes.com'
            });

            client.get('/svc/topstories/v1/home.json?api-key=1ff29048c95d49c154cd96910ab4b9c7:19:71761873', pushNytStories);

        },

        pushNytStories = function(err, req, res, obj) {

            for (var i = 0; i < obj.num_results; i++) {
                stories.push({
                    "title": obj.results[i].title,
                    "url": obj.results[i].url,
                    "source": "nyt"
                });
            }

            console.log('Pushed NYT Stories');

            getHnStories();

        },

        getHnStories = function() {
            console.log('Getting HN Stories');

            var client = restify.createJsonClient({
                url: 'https://hacker-news.firebaseio.com'
            });

            client.get('/v0/topstories.json', function(err, req, res, obj) {
                for (var i = 0; i < 10; i++) {
                    getHnStory(obj[i]);
                }
            });

        },

        getHnStory = function(item) {

            var client = restify.createJsonClient({
                url: 'https://hacker-news.firebaseio.com'
            });

            client.get('/v0/item/' + item + '.json', function(err, req, res, obj) {
                console.log('Got HN story ' + items);

                stories.push({
                    "title": obj.title,
                    "url": obj.url,
                    "source": "hn"
                });

                if (items === 9){
                    console.log('Pushed HN Stories');

                    end();
                }

                items++;

            });

        },

        end = function(){
            res.json(stories);
        }
    ;

    start();

});

module.exports = router;