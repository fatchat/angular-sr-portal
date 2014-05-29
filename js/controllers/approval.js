/*
 * @brief Controller definition for a new service request
 */
'use strict';

// create controller, inject dependencies
app.controller('ApprovalController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

	// base URL 
	var BRIDGE_URL="http://localhost/Bridge/get-pending-approvals/";

	$scope.pendingApprovals = {};
	if($routeParams.approverId !== undefined) {
		$http({ method: 'GET', url: BRIDGE_URL + $routeParams.approverId})
			.success(function(data, status) {
				console.log("pending approvals");
				// get list of approvals pending for this approver
				data.forEach(function(approval) {
				
					var newApproval = {};
					// extract wf details
					newApproval.reqTime = approval.wfDetail.reqTime;
					newApproval.snTicketId = approval.wfDetail.snTicketId;
					// extract wf parameters
					approval.wfDetail.wfParams.forEach(function(parameter) {
						if(parameter.param === "ssoId") {
							newApproval.ssoId = parameter.value;
						}
						else if(parameter.param === "reqSize") {
							newApproval.reqSize = parameter.value;
						}
					});
					//
					console.log(newApproval);
					$scope.pendingApprovals[newApproval.snTicketId] = newApproval;
				});
			})
			.error(function() {
				console.log("error getting pending approvals");
			});
	}
	
	var ORCH_URL = "http://localhost/Orchestrator/performAction?";
	// approve or deny a request
	$scope.respondToRequest = function(snTicketId, response) {
	
		$http({method : 'GET', url: ORCH_URL + "Src=ResumeIMS&Message=" + snTicketId + "," + response})
			.success(function(data, status) {
				console.log("request sent");
				delete $scope.pendingApprovals[snTicketId];
			})
			.error(function(data, status) {
			
			});
	}
}]);