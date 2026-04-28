/* Key | Requirements met on page: E. line 2 */
/* E. Add JavaScript code to the web form that produces an alert box if the two email fields do not match. */

/* Used to validate webform.html user-question email entries match. */

function emailmatch(){
    let email_1 = document.forms["user-question"]["email"].value;
    let email_2 = document.forms["user-question"]["email-confirm"].value;

    if (email_1 != email_2) {
        alert("The two emails do not match.")
    }
    else {
        alert("Submission approved.")
    };
}

