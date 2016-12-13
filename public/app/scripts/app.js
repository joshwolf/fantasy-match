'use strict';

/**
 * @ngdoc overview
 * @name fantasyMatchApp
 * @description
 * # fantasyMatchApp
 *
 * Main module of the application.
 */
angular
	.module('fantasyMatchApp', [
		'ngAnimate',
		'ngCookies',
		'ngMessages',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngStorage',
		'ngTouch',
		'ngUAParser',
		'ui.select',
		'ui.bootstrap',
		'720kb.datepicker',
		'angular.filter',
		'angularSpinner',
		'chart.js',
		'ordinal',
	])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl',
				controllerAs: 'mainController',
				page_title: 'Home'
			})
			.when('/league/:id', {
				templateUrl: 'views/game.html',
				controller: 'GameCtrl',
				controllerAs: 'gameController',
				page_title: 'Game'
			})
			.when('/new-league', {
				templateUrl: 'views/new-league.html',
				controller: 'GameCtrl',
				controllerAs: 'leagueController',
				page_title: 'Add a League'
			})
			.otherwise({
				redirectTo: '/'
			});
	})
	.config(function ($locationProvider) {
		$locationProvider.html5Mode(true);
	})
	.config(['$uibTooltipProvider', function ($uibTooltipProvider) {
		 var parser = new UAParser();
		 var result = parser.getResult();
		 var touch = result.device && (result.device.type === 'tablet' || result.device.type === 'mobile');
		 if ( touch ){
			 $uibTooltipProvider.options({trigger: 'dontTrigger'});
		 } else {
			 $uibTooltipProvider.options({trigger: 'mouseenter'});
		}
	}])
	.directive('randomBackgroundColor', function() {
		return {
			link: function(scope, element) {
				element.attr('style','background-color:' + "#000000".replace(/0/g,function(){return (~~((Math.random()*8)+8)).toString(16);}));
			}
		}
	})
	.directive('userIcon', function ($document, $window) {
		return {
				restrict: 'E',
				templateUrl: 'partials/userIcon.html',
				transclude: true,
				scope: {
						user: '=',
						rank: '=',
						noLink: '='
				},
				link: function(scope, element, attrs) {
					scope.showUser = function(id) {
						if(!scope.noLink) {
							$window.location.href = '/user/' + id;
						}
					}
				}
		};
	})
	.directive('league', function ($document, $window) {
		return {
				restrict: 'E',
				templateUrl: 'partials/league.html',
				transclude: true,
				scope: {
					leagueData: '='
				}
		};
	})
	.directive('leagueForm', function ($document, $window) {
		return {
				restrict: 'E',
				templateUrl: 'partials/leagueForm.html',
				transclude: true,
				scope: {
					newLeague: '='
				},
				link: function(scope, element, attrs) {
					scope.teamRange = _.range(8,31);
					scope.new_league = { start_year: 2016, fee: 0 };
					scope.all_offensive_categories = ['AB','CS','R+RBI-HR','R','Errors','SB-.5CS','HR','3B','TB+BB','RBI','1B','H+BB','SB','2B','TB+SB','AVG','2B+3B','R+RBI','OBP','K','R-HR','SLG','HBP','2*2B+3*3B','OPS','GIDP','BB/K','SB-CS','H','2*3B+SB','TB','XBH','TB-HR','SB%','G','2B+3B+BB','BB','PA'];
					scope.all_defensive_categories = ['IP','Shutout','WP','ERA','BB','SV+HLD','W','BB/9','SV+.5HLD','SV','Balks','W+CG+SHO','K','Blown SV','SV+.35HLD','WHIP','CG','W+.5SV','Outs','ER','W-L','K/9','App','(H+BB-K)/IP','K/BB','HR','W+QS','L','IBB','HR/9','SV-BS','HBP','H/9','R','Holds','Win%','QS','GIDP','K-BB','TB','GS','2*W-L','TBF','H','QS+CG+SHO','SB Allowed'];
					scope.offensive_tag_match = function(match) {
						if(match && _.some(scope.all_offensive_categories, (category) => category == match.toUpperCase())) {
							return match.toUpperCase();
						} else {
							return undefined;
						}
				    };
				    scope.defensive_tag_match = function(match) {
						if(match && _.some(scope.all_defensive_categories, (category) => category == match.toUpperCase())) {
							return match.toUpperCase();
						} else {
							return undefined;
						}
				    };
				    scope.startsWith = function (category, search) {
				    	return category.indexOf(search.toUpperCase()) == 0;
				    }
				    scope.noTab = function(event) {
				    	if (event.code == 'Tab') {
				    		event.preventDefault();
				    	}
				    }
				}
		};
	})
	.directive('resize', function($window) {
	  return {
		link: function(scope) {
		  function onResize(e) {
			// Namespacing events with name of directive + event to avoid collisions
			scope.$broadcast('resize::resize');
			var windowWidth = 'innerWidth' in window ? window.innerWidth : document.documentElement.offsetWidth;
			if(windowWidth <= 992) {
				scope.isMobile = true;
			} else {
				scope.isMobile = false;
			}
			scope.$apply();
		  }

		  function cleanUp() {
			angular.element($window).off('resize', onResize);
		  }

		  angular.element($window).on('resize', onResize);
		  scope.$on('$destroy', cleanUp);
		}
	  }
	})
	.directive('showHelp', function($rootScope, $window) {
		return {
			restrict: 'E',
			template: '<i class="fa fa-question-circle fa-inverse fa-2x" aria-hidden="true"></i>',
			link: function(scope, elem, attrs) {
				$rootScope.showHelp = false;
				$('body').bind('chardinJs:stop', function() {
					$('body').chardinJs('stop');
				});
		        elem.bind('click', function() {
					$('body').chardinJs('start');
				});
			}
		}
	})
	.filter('startFrom', function () {
		return function (input, start) {
			if (input === undefined || input === null || input.length === 0) return [];
			start = +start; //parse to int
			return input.slice(start);
		}
	})
	.filter('ordinalDate', function ($filter) {
		return function (date) {
			return $filter('date')(date, 'MMMM') + ' ' + $filter('ordinal')($filter('date')(date, 'd'));
		}
	})
	.filter('humanizedList', function() {
		return function(items) {
			var _items = (items || []);
			if (_items.length < 2)
			{
				return _items[0];
			}
			else {
				return _items.slice(0, -1).join(', ') + ' and ' + _.last(_items);
			}
		};
	})
	.run(['$rootScope', function($rootScope) {
		$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
				$rootScope.page_title = current.$$route.page_title;
		});
}]);
