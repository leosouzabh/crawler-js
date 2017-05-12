angular.module('verticalvert', ['ngRoute', 'verticalService', 'ngSanitize'])

	.config(function($routeProvider, $locationProvider, $httpProvider, $httpParamSerializerJQLikeProvider) {
		$routeProvider.when('/login', {
			templateUrl: 'partials/login.html',
			controller: 'LoginController'
		});
		$routeProvider.otherwise({redirectTo: '/login'});


		$httpProvider.defaults.transformRequest.unshift($httpParamSerializerJQLikeProvider.$get());
	    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';

	})
