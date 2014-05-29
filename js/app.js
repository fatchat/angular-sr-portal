/*
 * @brief Define the angular app, set up routes
 */
 
'use strict';

// define the AngularJS application. Include the ngRoute and ngResource modules
var app=angular.module('SRPortal', ['ngRoute', 'ngResource', 'ui.bootstrap']);

// Set up routing
app.config(['$routeProvider', function($routeProvider) {
	// show a list of current service requests
	$routeProvider.when('/', {
		templateUrl: 'partials/home_screen.html',
		controller: 'HomeScreenController'
	})
	// specify and submit a new service request
	.when('/new-request', {	
		templateUrl: 'partials/new_request.html',
		controller: 'NewRequestController'
	})
	// specify and submit a new service request
	.when('/approval/:approverId', {	
		templateUrl: 'partials/approval.html',
		controller: 'ApprovalController'
	})
	// default to the home screen
	.otherwise({
		redirectTo: '/'
	});
}]);

function safeApply(scope, fn) {
    (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
}
