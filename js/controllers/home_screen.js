/*
 * @brief Home screen controller definition
 */
'use strict';

// controller for the home screen
app.controller('HomeScreenController', ['$scope', '$http', '$position', function($scope, $http, $position) {

	var BRIDGE_URL="http://localhost/Bridge";
	$scope.serviceRequests = {};
	
	$scope.loadWorkflows = function () {

		console.log("Requesting workflow list");
		$http({
				method: 'GET',
				url : BRIDGE_URL + "/workflows/" + new Date().getTime(),
				cache: false
			}).success(function(data, status) {
				console.log("Got workflows, status=" + status);
				console.log(data);
				$scope.serviceRequests = {};
				// fill up the serviceRequests collection
				for(var i=0; i < data.length; i++) {
					var newObj = {
						wfName		: data[i].wfName,
						reqTime		: data[i].reqTime,
						snTicketId	: data[i].snTicketId,
						comments	: data[i].comments,
						status		: data[i].status,
						wfParams	: data[i].wfParams
					};
					// status_label is used as a CSS class
					switch(newObj.status) {
						case "Complete":
						case "Success":
						newObj.status_label = "label-success";
						break;

						case "Failure":
						case "Error":
						newObj.status_label = "label-danger";
						break;
						
						default:
						newObj.status_label = "label-warning";
					}
					// Display a more user-friendly workflow name
					switch(newObj.wfName) {
						case "IMS":
						newObj.fullWFName = "Increase Mailbox Size";
						$scope.serviceRequests[newObj.snTicketId] = newObj;
						break;

						case "BDE":
						newObj.fullWFName = "Bulk Data Extract";
						if(newObj.comments === "Success: results are ready to download") {
							// get the results and cache
							//console.log("Adding object " + newObj.snTicketId + " to serviceRequests");
							$scope.serviceRequests[newObj.snTicketId] = newObj;
							$http({
								method: 'GET',
								url : BRIDGE_URL + "/get-bde-results/" + newObj.snTicketId,
								cache: false
							}).success(function(data) {
								console.log("get-bde-results returned");
								console.log(data);
								$scope.serviceRequests[data.snTicketId].results = data.results;
							});
						}
						else {
							console.log("undef " + newObj.snTicketId);
							newObj.results = null;
							console.log(newObj);
							$scope.serviceRequests[newObj.snTicketId] = newObj;
						}
						break;

						default:
						console.log("unknown wf " + newObj.wfName)
						newObj.fullWFName = newObj.wfName;
						$scope.serviceRequests[newObj.snTicketId] = newObj;
					}
				}
				//console.log($scope.serviceRequests);
			});
	}

	// used in the my-download directive
	$scope.getCSV = function(sr){
//		console.log("Get CSV:"); console.log(sr.results);
        return new Blob([sr.results], {type: "text/csv", endings: "native"});
    };

	// function to close a service request 
	$scope.closeRequest = function(snTicketId) {
		if (snTicketId !== null) {
			console.log("Closing ticket " + snTicketId);
			$http({method: 'GET', url: BRIDGE_URL + "/close-request/" + snTicketId, cache: false })
				.success(function(data) {
					// add this ticket number to the list of closed. this is to avoid adding them to the list in loadWorkflows
					console.log("ticket closed");
					// reload workflows after one is closed
					delete $scope.serviceRequests[snTicketId];
				}
			);
		}
	};
	
	// load workflow list the first time
	console.log("initial load");
	$scope.loadWorkflows();
}]);


app.directive('myDownload', function ($compile) {
    return {
        restrict:'E',
        scope:{ getUrlData:'&getData'},
        link:function (scope, elm, attrs) {
            var myurl = URL.createObjectURL(scope.getUrlData());
            elm.append($compile(
                '<a class="btn btn-success" download="results.csv"' +
                    'href="' + myurl + '">' +
                    'Success: Download results' +
                    '</a>'
            )(scope));
        }
    };
});