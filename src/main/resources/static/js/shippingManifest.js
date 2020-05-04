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
    var priority = $('#people').val();
    val destination = $('#destination').val();
    val originator = $('#originator').val();
    val type = $('#type').val();

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
    if (numPeople > MAX_PRIORITY) {
        errorMessages.push("Priority must be a positive non-zero integer that's at least 5.");
        return false;
    }

    return true;
}

function showResults(destination, originator, priority, type) {
    // submit the request to service mesh
    $.ajax({
        type: "post",
        url: generateRequestUrl(destination, originator, priority, type),
        data: "",
        success: function (data) {
            console.log("Submission was successful.");
            console.log(data);
            $("#manifestResult").html("<label>" + data + "</label>");
        },
        error: function (data) {
            console.log("Something went wrong.");
            $("#manifestResult").html("");
        },
    });

}

function generateRequestUrl(hike, date, duration, numPeople) {
    date = moment(date, "YYYY-MM-DD");

    //TODO update to send as Rabbit message
    var requestUrl = "https://web6.jhuep.com/fach_hw8/beartoothQuotingWizard";
    requestUrl = requestUrl + ("?trail=" + hike);

    // month is zero indexed in moment
    requestUrl = requestUrl + ("&month=" + (date.month() + 1));
    requestUrl = requestUrl + ("&day=" + date.date());
    requestUrl = requestUrl + ("&year=" + date.year());
    requestUrl = requestUrl + ("&duration=" + duration);
    requestUrl = requestUrl + ("&numPeople=" + numPeople);

    return requestUrl;
}