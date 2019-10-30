var CONFIRM_ARCHIVE = "New programs will be unable to use this disaggregation. (Programs already using the disaggregation will be unaffected.)";
var CONFIRM_UNARCHIVE = "All programs will be able to use this disaggregation.";
var CONFIRM_MESSAGE = "Are you sure you want to continue?";
document.addEventListener("DOMContentLoaded", function() {
    var archiveBox = document.getElementById('id_is_archived');
    archiveBox.addEventListener('change', function(ev) {
        if (this.checked) {
            if (!window.confirm(`${CONFIRM_ARCHIVE}\n${CONFIRM_MESSAGE}`)) {
                this.checked = false;
            }
        } else {
            if (!window.confirm(`${CONFIRM_UNARCHIVE}\n${CONFIRM_MESSAGE}`)) {
                this.checked = true;
            }
        }
    })
})