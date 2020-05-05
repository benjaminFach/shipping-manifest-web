// constants (and their initialization)

// minimum priority
var MIN_PRIORITY = 0;

// maximum priority
var MAX_PRIORITY = 5;

// global variable to build error message, so all errors are presented to user after submission.
var errorMessages = Array();


/*
 * Validates information from user requesting shipment.
 * Should be called on form submission before posting to next microservice.
 * Displays error message and does not post if invalid input is detected.
 */
function processManifest() {
    // clear the error message queue
    errorMessages = Array();

    // grab values from form
    var priority = $('#priority').val();
    var destination = $('#destination').val();
    var originator = $('#originator').val();
    var type = $('#type').val();

    // validate each field that requires validation
    var isValidPriority = validatePriority(priority);

    // place error messages (if any) into error message display div
    if (errorMessages.length > 0) {
        alert(errorMessages.join("\n"));
        $("#manifestResult").html("");
        return false;
    }

    showResults(destination, originator, priority, type);

    return false;
}

/*
 * Checks if a priority was chosen and if so, if it is a valid priority.
 * If priority is invalid, add a relevant message to the error message queue and return false.
 * Otherwise return true.
 */
function validatePriority(priority) {
    // check if a number of people was provided
    if (typeof priority == 'undefined') {
        errorMessages.push("Priority must be a positive non-zero integer.");
        return false;
    }

    // ensure priority specified is a number
    if (isNaN(priority)) {
        errorMessages.push("Priority must be a positive non-zero integer.");
        return false;
    }

    // ensure priority above the minimum
    if (priority < MIN_PRIORITY) {
        errorMessages.push("Priority must be a positive non-zero integer.");
        return false;
    }

    // ensure priority is below or equal to maximum
    if (priority > MAX_PRIORITY) {
        errorMessages.push("Priority must be a positive non-zero integer that's at most 5.");
        return false;
    }

    return true;
}

function showResults(destination, originator, priority, type) {
    // submit the request to manifest endpoint
    payload = generateJsonPayload(destination, originator, priority, type)
    $.ajax({
        type: "post",
        url: "http://localhost:8080/createManifest",
        data: payload,
        success: function (data) {
            console.log("Submission was successful.");
            console.log(data);
            $("#manifestResult").html("<label>" + data + "</label>");
        },
        error: function (data) {
            console.log("Something went wrong.");
            console.log(data)
            console.log(payload);
            $("#manifestResult").html("");
        },
    });

}

function generateJsonPayload(destination, originator, priority, type) {
    var jsonData = {};

    // default date to now as milliseconds since epoch time
    var now = moment().valueOf();

    jsonData["manifestCreateTime"] = now;
    jsonData["destination"] = destination;
    jsonData["originator"] = originator;
    jsonData["priority"] = priority;
    jsonData["type"] = type;

    return jsonData
}