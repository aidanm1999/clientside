let globalTalks;

$(document).ready(
    function () {
        gettalks();
        $("#Search").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#talklist tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
        openTab(event, 'Talks');
    }
);





function gettalks() {
    // Gets the sessions in the talks
    $.ajax({
        url: "http://localhost:3000/sessions", success: function (sessions) {
            $.ajax({
                url: "http://localhost:3000/talks", success: function (talks) {
                    globalTalks = talks;
                    var talkList = document.getElementById("talklist");
                    //talkList.innerHTML="";
                    for (i = 0; i < talks.length; i++) {
                        var value = talks[i];    // using ad-hoc object

                        // Create table datas
                        var tableRow = document.createElement("tr");
                        var tableHeadNumber = document.createElement("th"); // Add scope = row                
                        var tableDataName = document.createElement("td");
                        var tableDataSpeaker = document.createElement("td");
                        var tableDataSession = document.createElement("td");
                        var tableDataTag = document.createElement("td");
                        var tableDataInterested = document.createElement("td");
                        var tableDataRating = document.createElement("td");
                        tableDataRating.setAttribute("id", "avg_rating_" + value.id);
                        var tableDataYourRating = document.createElement("td");





                        // CREATE TEXT NODES -------------------------------------------------------------------------------------------------------------------
                        // NUMBER
                        var numberText = document.createTextNode(value.id);

                        // NAME
                        var nameText = document.createTextNode(value.title);

                        // SPEAKER
                        var speakerText = document.createTextNode(value.speaker);

                        // SESSION
                        var sessionLocation = "";
                        sessions.forEach(element => {
                            if (element.id == value.session) {
                                sessionLocation = element.location;
                            }
                        });
                        var sessionText = document.createTextNode(sessionLocation);

                        // TAGS
                        var tagString = "";
                        value.tags.forEach(element => {
                            tagString = tagString.concat("#", element, " ");
                        });
                        var tagText = document.createTextNode(tagString);

                        // INTERESTED
                        var interestedLink = document.createElement('a');
                        interestedLink.setAttribute("onclick", "openTab(event, 'Schedule');addToSchedule(" + value.id + ");");
                        interestedLink.setAttribute("title", "Add event to your schedule");
                        interestedLink.setAttribute("href", "#");
                        var interestedText = document.createTextNode(value.time);
                        interestedLink.appendChild(interestedText);


                        // AVERAGE RATING
                        var rating = 0;
                        if (value.ratings.length > 0) {
                            value.ratings.forEach(element => {
                                rating += parseInt(element);
                            });
                            rating = rating / value.ratings.length;
                        }
                        var ratingText = document.createTextNode(rating.toFixed(2));

                        // YOUR RATING
                        var yourRatingText = document.createElement("SELECT");
                        yourRatingText.setAttribute("id", value.id);
                        for (let index = 1; index <= 5; index++) {
                            var optionElement = document.createElement("OPTION");
                            optionElement.setAttribute("value", index);
                            var textNodeInOption = document.createTextNode(index);
                            optionElement.appendChild(textNodeInOption);
                            yourRatingText.appendChild(optionElement);
                        }

                        yourRatingText.addEventListener("change", (function (event) {
                            $.ajax({
                                url: "http://localhost:3000/talks/rate/" + event.target.id + "/" + event.target.value, success: function (result) {
                                    var newAvg = 0;
                                    if (result.ratings.length > 0) {
                                        result.ratings.forEach(element => {
                                            newAvg += parseInt(element);
                                        });
                                        newAvg = newAvg / result.ratings.length;
                                    }
                                    var newAvgElement = document.getElementById("avg_rating_" + event.target.id);
                                    newAvgElement.innerHTML = newAvg.toFixed(2);

                                }
                            });

                        }));





                        // Add text nodes to table datas
                        tableHeadNumber.appendChild(numberText);
                        tableDataName.appendChild(nameText);
                        tableDataSpeaker.appendChild(speakerText);
                        tableDataSession.appendChild(sessionText);
                        tableDataTag.appendChild(tagText);
                        tableDataInterested.appendChild(interestedLink);
                        tableDataRating.appendChild(ratingText);
                        tableDataYourRating.appendChild(yourRatingText);

                        // Add table datas to table row
                        tableRow.appendChild(tableHeadNumber);
                        tableRow.appendChild(tableDataName);
                        tableRow.appendChild(tableDataSpeaker);
                        tableRow.appendChild(tableDataSession);
                        tableRow.appendChild(tableDataTag);
                        tableRow.appendChild(tableDataInterested);
                        tableRow.appendChild(tableDataRating);
                        tableRow.appendChild(tableDataYourRating);

                        // Add table row to table
                        talkList.appendChild(tableRow);
                    }
                }
            });
        }
    });


}