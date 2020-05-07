// constants (and their initialization)

// minimum priority
var MIN_PRIORITY = 0;

// maximum priority
var MAX_PRIORITY = 5;

// global variable to build error message, so all errors are presented to user after submission.
var errorMessages = Array();

// store manifest ID when ReST service returns is after first submission
var manifestId = 0

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
        url: "http://localhost:8091/manifest/create",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(payload),
        success: function (data) {
            console.log("Submission was successful.");
            console.log(data);
            $('#manifest-line-items').fadeIn(2000);
            var parsedData = JSON.parse(data);
            manifestId = parsedData.id;
            console.log(manifestId);
            $(".shipping-form-buttons").remove();

        },
        error: function (data) {
            console.log("Something went wrong.");
            console.log(data)
            console.log(payload);
            $("#manifestResult").html("<p><b>Sorry there was a problem with your submission, please try again later</b></p>");
        },
    });

}

function generateJsonPayload(destination, originator, priority, type) {
    var jsonData = {};

    // default date to now as milliseconds since epoch time
    var now = moment().valueOf();

    jsonData["timeCreated"] = now;
    jsonData["destination"] = destination;
    jsonData["originator"] = originator;
    jsonData["priority"] = priority;
    jsonData["type"] = type;

    return jsonData
}

/** Line items **/

/*
 * Validates information from user requesting shipment line items.
 * Should be called on form submission before posting to next microservice.
 * Displays error message and does not post if invalid input is detected.
 */
function processManifestLineItems() {
    // clear the error message queue
    errorMessages = Array();

    // grab values from form
    var lineItems = [];
    $("input[name='line-item[]']").each(function() {
        lineItem = {}
        lineItem["itemName"] = $(this).val()
        lineItem["manifestId"] = manifestId;
        lineItems.push(lineItem);
    });
    console.log(lineItems)

    return false;
}

$(document).ready(function() {
    var max_fields = 5;
    var wrapper = $("#manifest-line-items");
    var add_button = $(".add_form_field");

    var x = 1;
    $(add_button).click(function(e) {
        e.preventDefault();
        if (x < max_fields) {
            x++;
            $(wrapper).append('<div><input type="text" name="line-item[]"/><button class="btn btn-danger delete">Delete Line Item</button></div>'); //add input box
        } else {
            alert('You Reached the limits')
        }
    });

    $(wrapper).on("click", ".delete", function(e) {
        e.preventDefault();
        $(this).parent('div').remove();
        x--;
    })
});