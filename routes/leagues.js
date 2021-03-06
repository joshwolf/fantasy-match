var nconf = require('nconf');
var _ = require('lodash');
var models  = require('../models');
var express = require('express');
var router  = express.Router();
var util = require('util');
var authConfig = require('../config/auth');
var session = require('express-session')
var jwt = require('jsonwebtoken');
var initCacher = require('sequelize-redis-cache');
var redis = require('redis');

var redisClient  = redis.createClient(nconf.get('REDIS_PORT'), nconf.get('REDIS_SERVER'));
if (nconf.get('REDIS_AUTH')) {
	redisClient.auth(nconf.get('REDIS_AUTH'));
}

var cacher = initCacher(models.sequelize, redisClient);

var leagueCache = cacher('League')
  .ttl(5);

function loggedIn(req, res, next) {
    if (req.session.user) {
        next();
    } else if (req.body.token) {
		jwt.verify(req.body.token, authConfig.jwt.secret, function(err, decoded) {
		  if(decoded) {
		  	next();
		  } else {
		  	res.status(401).send('You must be logged in');
		  }
		});
    } else {
        res.status(401).send('You must be logged in');
    }
}

router.get('/all', function(req, res) {
	models.League.findAll().then(function(leagues) { res.jsonp(leagues); });
});

/*
router.post('/new', loggedIn, function(req, res) {
	gameplay_data = req.body.data;
	if (gameplay_data.play_date && gameplay_data.scores) {
		//create any new users
		var new_users = _.filter(gameplay_data.scores, (score) => !score.player.id);
		return models.sequelize.transaction(function (t) {
			var promises = [];
			_.each(gameplay_data.scores, function(score) {
				if(!score.player.id) {
					var newPromise =  models.User.findOrCreate({ where: {
							full_name: score.player.full_name, 
							first_name: score.player.first_name,
							last_name: score.player.last_name
						},transaction: t})
						.spread(function(user) { score.player = user; });
					promises.push(newPromise);
				}
			});
			return Promise.all(promises);
		})
		.then(function(result) {
			var gameplay = models.Gameplay.create({
				play_date: gameplay_data.play_date,
				GameId: gameplay_data.game_id,
				CreatorId: gameplay_data.creator_id,
				Scores: _.map(gameplay_data.scores, function(score) { return { points: score.points, rank: score.rank, PlayerId: score.player.id }; })
			}, { include: {model: models.GameplayScore, as: 'Scores'}})
			.then(function(gameplay) {
				gameplay.save().then(function(gameplay) { gameplay.reload({ include: [{model: models.Game}, {model: models.GameplayScore, as: 'Scores', include: [{model: models.User, as: 'Player'}] }] }).then(function(scores) { res.jsonp(gameplay); }); });
			});
		})
		.catch(function(error) { console.log(error); });
	}
});
*/


router.get('/:id', function(req, res) {
	models.League.find({where: {id: req.params.id}})
		.then(function(league) {
			res.jsonp(league);
		});
});

module.exports = router;
