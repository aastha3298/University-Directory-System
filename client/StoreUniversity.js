const BASE_URL = "http://localhost:3000";
const SAVE_HOOK_URL = BASE_URL + "/saveUniversity";
const DELETE_HOOK_URL = BASE_URL + "/deleteUniversity";
const GET_HOOK_URL = BASE_URL + "/getUniversity";
const GET_ALL_HOOK_URL = BASE_URL + "/getAllUniversities";

function wipeTable() {
    $("#displayTable").find("tr:gt(0)").remove();
}

function addRow(n, nsquare, ncube) {
    $("#displayTable tr:last").after("<tr><td>"+n+"</td><td>"+nsquare+"</td><td>"+ncube+"</td></tr>");
}

function draw() {
    wipeTable();
    $.get(GET_ALL_HOOK_URL, function( data ) {
        let universities = JSON.parse(data);
        wipeTable();
        if (universities.length == 0) {
            alert("You need to add universities first!");
            return;
        }
        for (let i=0; i < universities.length; i++) {
            let university = universities[i];
            addRow(university.Name, university.Address, university.PhoneNumber);
        }
    }).fail(function(error) {
        alert("Error: "+error.reponseText);
    });
}

function validString(str) {
    return str != undefined && str !== "";
}

function validateUniversityData(universityData) {
    return validString(universityData.Name) && validString(universityData.Address) && validString(universityData.PhoneNumber);
}

function validateSaveData() {
    let universityData = {
        Name: $('#name').val(),
        Address: $('#address').val(),
        PhoneNumber: $('#phone').val(),
    };
    return validateUniversityData(universityData);
}

function saveInformation() {
    if (!validateSaveData()) {alert("Entered data is invalid!"); return;}
    let universityData = {
        Name: $('#name').val(),
        Address: $('#address').val(),
        PhoneNumber: $('#phone').val(),
    };
    $.post(SAVE_HOOK_URL, universityData, function(resultData) {
        alert("University has been added!");
    }).fail(function(error) {
        alert("Error: "+error.reponseText);
    });
}

function validateDeleteData() {
    let universityData = {
        Name: $('#deleteKey').val(),
    }
    return validString(universityData.Name);
}

function deleteInformation() {
    if (!validateDeleteData()) {alert("Entered data is invalid!"); return;}
    let universityData = {
        Name: $('#deleteKey').val(),
    }
    console.log(universityData);
    $.post(DELETE_HOOK_URL, universityData, function(resultData) {
        let reply = JSON.parse(resultData);
        if (!reply.success) { alert(reply.message); return; }
        alert("University has been removed!");
    }).fail(function(error) {
        alert("Error: "+error.reponseText);
    });
}

function validateSearchData() {
    let universityData = {
        Name: $('#searchKey').val(),
    }
    return validString(universityData.Name);
}

function searchInformation() {
    if (!validateSearchData()) {alert("Entered data is invalid!"); return;}
    let universityData = {
        Name: $('#searchKey').val(),
    }
    $.post(GET_HOOK_URL, universityData, function(resultData) {
        if (!validateUniversityData(resultData)) {alert("Couldn't find the specified university!"); return;}
        $("#searchName").val(resultData.Name);
        $("#searchAddress").val(resultData.Address);
        $("#searchPhone").val(resultData.PhoneNumber);
        alert("Found the matched university!");
    }).fail(function(error) {
        alert("Error: "+error.reponseText);
    });
}

$(document).on('pagebeforeshow', '#displayrecords', function (event) {
    draw();
});

$(document).on('pagebeforehide', '#displayrecords', function (event) {
    wipeTable();
});
