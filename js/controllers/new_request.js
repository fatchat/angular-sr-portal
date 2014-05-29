/*
 * @brief Controller definition for a new service request
 */
'use strict';

// create controller, inject dependencies
app.controller('NewRequestController', ['$scope', '$http', '$location', function($scope, $http, $location) {

	// selected SR menu item, default to None
	$scope.sr = 'None';

	// base URL for orchestrator
	var BRIDGE_URL="http://localhost/Bridge/new-request?";

	// input object for IMS
	$scope.ims = {
		snTicketId : '',
		ssoId : '',
		reqSize : 100
	};

	// validation function
	var validateIMSinput = function(input) {
		return (input.snTicketId !== '' && input.ssoId !== '');
	};
	
	// submission function for IMS
	$scope.submitIMS = function() {	
		console.log($scope.ims);
		if(validateIMSinput($scope.ims)) {
			$http({method: 'GET', url: BRIDGE_URL 
							+ "wfName=IMS&" 
							+ "snTicketId=" + $scope.ims.snTicketId 
							+ "&ssoId=" + $scope.ims.ssoId 
							+ "&reqSize=" + $scope.ims.reqSize})
				.success(function(data) {
					$location.path('/');
				});
		} else {
			console.log("IMS input failed validation:" + $scope.ims);
		}
	};
	
	// input object for BDE
	$scope.bde = {
		snTicketId: '',
		ddlName : ''
	};
	
	// input validation function
	var validateBDEInput = function(input) {
		return (input.snTicketId !== '' && input.ddlName !== '');
	};
	
	// submission function for BDE
	$scope.submitBDE = function() {
		console.log($scope.bde);
		if(validateBDEInput($scope.bde)) {
			$http({method: 'GET', url: BRIDGE_URL 
							+ "wfName=BDE&" 
							+ "snTicketId=" + $scope.bde.snTicketId 
							+ "&ddlName=" + $scope.bde.ddlName})
				.success(function(data) {
					$location.path('/');
				});
		} else {
			console.log("input failed validation:" + $scope.bde);
		}
	};
}]);
