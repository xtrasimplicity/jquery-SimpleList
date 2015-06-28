(function($) {
    $.fn.simpleList = function( options ) {

        var defaults = $.extend({
            valueAttribute   : 'value',
            unassignedColumnHeader : 'Unassigned Items',
            assignedColumnHeader : 'Assigned Items',
            embeddedButtons : false,
            embeddedButtonAddHtml : '<i class="btn btn-success glyphicon glyphicon-arrow-right" style="float:right;"></i>',
            embeddedButtonRemoveHtml : '<i class="btn btn-success glyphicon glyphicon-arrow-left" style="float:right;"></i>',
            tableWidth: '100%'
        });

        var settings = $.extend( {}, defaults, options);


        if($(this).length > 0) {
            // build destination list

            // Store the source List's ID attribute, so that we can use it later
            var idAttribute = $(this).attr("id");

            var destinationID = $(this).attr("id") + "_selected";
            
            // If re-initializing SimpleList on a single selector
            if ($("#" + destinationID).length > 0)
            {
                // before we remove existing elements, let's move the selected items *back* to the source list
                $("#" + $(this).attr("id") + "_remove_all").click();

                //TODO: Remove button duplication on re-initialization

                // restore the source List's name attribute
                var hiddenInputElement = $("[parentID=" + $(this).attr("id") + "]");

                var attribName = $(hiddenInputElement).attr("name");

                $(this).attr("name", attribName);

                var originalObj = $(this).clone(true);

                var destinationTable = $("#" + destinationID).closest("table");

                $(originalObj).insertAfter(destinationTable);
                $(destinationTable).empty().remove();

                $(hiddenInputElement).empty().remove();

                // We've removed all existing fields, so everything is back to normal. let's re-init simpleList on the element.
                $("#" + $(this).attr("id")).simpleList(options);
            }

            // Store the source list's name attribute, so that we can move it to the hidden input field (for form submission)
            var nameAttribute = $(this).attr('name');

            // Build a hidden field
            var hiddenFieldHTML = "<input type='hidden' parentID='" + idAttribute + "' name='" + nameAttribute + "' value='[]' />";

            // Remove the name attribute from the selected DOM element (source list)
            $(this).removeAttr('name');

            // Build destination List field
            var destField = $(this).clone(true).empty().attr("id", destinationID).get(0).outerHTML;

            // Build the new output (a table with 3 TD elements - 1) Source List, 2) Move/Remove buttons, 3) Destination List)
            var newField = "<table width='" + settings.tableWidth + "' style='overflow: scroll;'>" +
                                "<tr>" +
                                    "<th>" + settings.unassignedColumnHeader + "</th>" +
                                    "<th>" + settings.assignedColumnHeader + "</th>" +
                                "</tr>" +
                                "<tr>" +
                                    "<td>" + $(this).get(0).outerHTML + "</td>";

            if (!settings.embeddedButtons) {
                        newField += "<td>" +
                                        "<input type='button' value='>' id='" + $(this).attr("id") + "_add_single' /><br />" +
                                        "<input type='button' value='>>' id='" + $(this).attr("id") + "_add_all' /><br />" +
                                        "<input type='button' value='<' id='" + $(this).attr("id") + "_remove_single' /><br />" +
                                        "<input type='button' value='<<' id='" + $(this).attr("id") + "_remove_all' />" +
                                    "</td>";
            }

                        newField += "<td>" + destField + "</td>" +
                                "</tr>" +
                            "</table>";

            // Add the hidden field to this
            newField += hiddenFieldHTML;

            // Replace the source list's HTML with the new table (newField)
            $(this).replaceWith(newField);

            // Helper functions
            function removeItemFromHiddenField(itemValue)
            {
                var hiddenField = $("[name=" + nameAttribute + "]");
                var fieldData = JSON.parse($(hiddenField).val());

                var indexOfItem = fieldData.indexOf(itemValue);
                fieldData.splice(indexOfItem, 1);

                $(hiddenField).val(JSON.stringify(fieldData));
            }

            function addItemToHiddenField(itemValue)
            {
                var hiddenField = $("[name=" + nameAttribute + "]");

                var fieldData = JSON.parse($(hiddenField).val());

                fieldData.push(itemValue);

                $(hiddenField).val(JSON.stringify(fieldData));
            }

            function addSelectedElementToList(element, targetList) {
                var source = idAttribute;
                var destination = destinationID;

                if (element.length > 0) {
                    var $el = element.clone(true);

                    element.remove();

                    switch (targetList) {
                        case source:
                            $el.find(".sl-add").show();
                            $el.find(".sl-remove").hide();

                            removeItemFromHiddenField($el.attr(settings.valueAttribute));
                            break;
                        case destination:
                            $el.find(".sl-add").hide();
                            $el.find(".sl-remove").show();

                            addItemToHiddenField($el.attr(settings.valueAttribute));
                            break;
                    }

                    $("#" + targetList).append($el);

                    if (!settings.embeddedButtons) {
                        $("#" + source + " .sl-selected").removeClass("sl-selected");
                        $("#" + destination + " .sl-selected").removeClass("sl-selected");
                    }
                    /*
                     // element.detach();
                     */
                }
            }

            function appendCSSToElement(element, CssProperties) {
                var existingCSS = $(element).attr("style");

                if (existingCSS == undefined) existingCSS = "";

                $.each(CssProperties, function (key, value) {
                    existingCSS += " " + key + ": " + value + ";";
                });

                $(element).attr("style", existingCSS);

                return $(element);
            }

            // Event Handlers
            if (!settings.embeddedButtons) {
                $("#" + idAttribute + " > li, #" + destinationID + " > li").on("click", function () {
                    $("#" + idAttribute + " > li, #" + destinationID + " > li").removeClass("sl-selected");
                    $(this).addClass("sl-selected");
                });

                $("#" + idAttribute + "_add_single").on("click", function () {

                    var selectedItem = $("#" + idAttribute + " .sl-selected");

                    addSelectedElementToList(selectedItem, destinationID);
                });

                $("#" + idAttribute + "_remove_single").on("click", function () {

                    var selectedItem = $("#" + destinationID + " .sl-selected");

                    addSelectedElementToList(selectedItem, idAttribute);
                });

                // Add All
                $("#" + idAttribute + "_add_all").on("click", function () {
                    $("#" + idAttribute + " > li ").each(function () {
                        addSelectedElementToList($(this), destinationID);
                    });
                });

                // remove All
                $("#" + idAttribute + "_remove_all").on("click", function () {
                    $("#" + destinationID + " > li").each(function () {
                        addSelectedElementToList($(this), idAttribute);
                    });
                });


            }
            else {
                var addButton = $("<div />").html(settings.embeddedButtonAddHtml).children()[0];
                var removeButton = $("<div />").html(settings.embeddedButtonRemoveHtml).children()[0];


                appendCSSToElement(addButton, {display: "block"});
                $(addButton).addClass("sl-add");

                appendCSSToElement(removeButton, {display: "none"});
                $(removeButton).addClass("sl-remove");

                $("#" + idAttribute + " > li").append(addButton).append(removeButton);
                //$("#" + idAttribute + " > li").append(removeButton);


                $("#" + idAttribute + " .sl-add").on("click", function () {
                    addSelectedElementToList($(this).parent(), destinationID);
                });

                $("#" + idAttribute + " .sl-remove").on("click", function () {
                    addSelectedElementToList($(this).parent(), idAttribute);
                });
            }


        }
        else
        {
            alert("Error initializing SimpleList. Please ensure that the specified element exists.");
        }
    };

}(jQuery));
