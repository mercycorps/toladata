/*
 * Legacy Projects code
 *
 * DO NOT ADD NEW CODE HERE
 */

/*
* Save the task checkbox state
*/
function tasklistChange(pk,type,value){
    // send true or false back to the update and set the checkbox class
    if ($('#' + type + '_' + pk ).hasClass( "glyphicon glyphicon-check") == true ) {
        $.get('/workflow/checklist_update_link/' + pk + '/' + type + '/0/', function(data){
            $('#' + type + '_' + pk ).removeClass("glyphicon glyphicon-check").addClass("glyphicon glyphicon-unchecked");
        });
    }else{
        $.get('/workflow/checklist_update_link/' + pk + '/' + type + '/1/', function(data){
            $('#' + type + '_' + pk ).removeClass("glyphicon glyphicon-unchecked").addClass("glyphicon glyphicon-check");
        });
    }

}


$(document).ready(function() {
    /*
    *  Reload page if country dropdown changes on main dashboard
    */
    $('#something').click(function() {
        load(url, data, loadComplete);
    });

    /*
     * Handle change in the country drop-down; updates the province drop-down accordingly.
     */
    $("select#id_country").change(function() {
        var selected_country = $(this).val();
        if (selected_country == undefined || selected_country == -1 || selected_country == '') {
            $("select#id_country").html("<option>--Country--</option>");
        } else {
            var url = "/workflow/country/" + selected_country + "/country_json/";
            $.getJSON(url, function(province) {
                var options = '<option value="">--Level 1--</option>';
                for (var i = 0; i < province.length; i++) {
                    options += '<option value="' + province[i].pk + '">' + province[i].fields['name'] + '</option>';
                }

                $("select#id_province").html(options);
                $("select#id_province_option:first").attr('selected', 'selected');
            });
        }

        // page-specific-action call if a page has implemented the 'country_dropdwon_has_changed' function
        if(typeof country_dropdown_has_changed != 'undefined') country_dropdown_has_changed(selected_country);
    });


    /*
     * Handle change in the province drop-down; updates the district drop-down accordingly.
     */
    $("select#id_province").change(function() {
        var selected_province = $(this).val();
        if (selected_province == undefined || selected_province == -1 || selected_province == '') {
            $("select#id_province").html("<option>--Level 1--</option>");
        } else {
            var url = "/workflow/province/" + selected_province + "/province_json/";
            $.getJSON(url, function(district) {
                var options = '<option value="">--Level 2--</option>';
                for (var i = 0; i < district.length; i++) {
                    options += '<option value="' + district[i].pk + '">' + district[i].fields['name'] + '</option>';
                }

                $("select#id_district").html(options);
                $("select#id_district option:first").attr('selected', 'selected');
            });
        }

        // page-specific-action call if a page has implemented the 'country_dropdwon_has_changed' function
        if(typeof country_dropdown_has_changed != 'undefined') country_dropdown_has_changed(selected_country);
    });


    /*
     * Handle change in the province drop-down; updates the district drop-down accordingly.
     */
    $("select#id_district").change(function() {
        var selected_district = $(this).val();
        if (selected_district == undefined || selected_district == -1 || selected_district == '') {
            $("select#id_district").html("<option>--Level 2--</option>");
        } else {
            var url = "/workflow/district/" + selected_district + "/district_json/";
            $.getJSON(url, function(adminthree) {
                var options = '<option value="">--Level 3--</option>';
                for (var i = 0; i < adminthree.length; i++) {
                    options += '<option value="' + adminthree[i].pk + '">' + adminthree[i].fields['name'] + '</option>';
                }

                $("select#id_admin_level_three").html(options);
                $("select#id_admin_level_three option:first").attr('selected', 'selected');
            });
        }

        // page-specific-action call if a page has implemented the 'country_dropdwon_has_changed' function
        if(typeof country_dropdown_has_changed != 'undefined') country_dropdown_has_changed(selected_country);
    });


    /*
     * Handle change in office drop-down
     */
    $("select#id_district").change(function(vent) {
        var selected_distirct = $(this).val();
        if (selected_distirct == -1) {
            return;
        }

        // page-specific-action call if a page has implemented the 'office_dropdown_has_changed' function
        if(typeof district_dropdown_has_changed != 'undefined') distirct_dropdown_has_changed(district_office);
    });

/*
* CUSTOM DASHBOARD
*/
// COMMENTING OUT THE CUSTOM DASHBOARD BECAUSE NO ONE IS USING IT

    // on change to Step 2, selector, save change to db
    // on change to Step 3, selector, save change to db


    /*
     * UPDATE BUDGET TOTAL
    */
    function updateBudget()
    {
        var mc_budget = parseFloat($("#mc_budget").val());
        var other_bidget = parseFloat($("#other_budget").val());
        var total = mc_budget + other_budget;
        var total = total.toFixed(2);
        $("#total_budget").val(total);
    }
    $(document).on("change, keyup", "#mc_budget", updateBudget);
    $(document).on("change, keyup", "#other_budget", updateBudget);

    /*
     * Calculate Total Indirect Beneficiaries
    */
    function updateBens()
    {
        var direct_bens = parseFloat($("#id_estimated_num_direct_beneficiaries").val());
        var avg_houshold_size = parseFloat($("#id_average_household_size").val());
        var total = direct_bens * avg_houshold_size;
        var total = total.toFixed(2);
        $("#id_estimated_num_indirect_beneficiaries").val(total);
    }
    $(document).on("change, keyup", "#id_estimated_num_direct_beneficiaries", updateBens);
    $(document).on("change, keyup", "#id_average_household_size", updateBens);

    /*
     * Trained TOTAL
    */
    function updateTrained()
    {
        var male = parseFloat($("#id_estimate_male_trained").val());
        var female = parseFloat($("#id_estimate_female_trained").val());
        var total = male + female;
        var total = total.toFixed(0);
        $("#id_estimate_total_trained").val(total);
    }
    $(document).on("change, keyup", "#id_estimate_male_trained", updateTrained);
    $(document).on("change, keyup", "#id_estimate_female_trained", updateTrained);

    /*
     * CFW Workers TOTAL
    */
    function updateCFW()
    {
        var male = parseFloat($("#id_cfw_estimate_male").val());
        var female = parseFloat($("#id_cfw_estimate_female").val());
        var total = male + female;
        var total = total.toFixed(0);
        $("#id_cfw_estimate_total").val(total);
    }
    $(document).on("change, keyup", "#id_cfw_estimate_male", updateCFW);
    $(document).on("change, keyup", "#id_cfw_estimate_female", updateCFW);

    /*
    * Expand accordion down to location hash and then load results
    * clause pathname !== program/* to prevent this from interfering with react browserify hash usage on program page
    */
    if(location.hash != null && location.hash != "" && location.pathname.split('/')[1] !== 'program'){
        $('.collapse').removeClass('in');
        $(location.hash + '.collapse').collapse('show');
        indicator_id = location.hash.split('-')
    }

});


/*
* Confirm Change of Short form to Long
*/
function confirmshort() {
      if (document.getElementById('id_short').checked == true) {
        return false;
      } else {
       var box= confirm("Warning: The short form is recommended for all cases except COMPLEX programs.  Are you sure you want to do this?");
        if (box==true)
            return true;
        else
           document.getElementById('id_short').checked = true;

      }
    }
