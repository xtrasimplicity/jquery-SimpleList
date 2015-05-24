(function($) {
    $.fn.simpleList = function( options ) {

        var defaults = $.extend({
           valueAttribute   : 'value'
        });
        
        var settings = $.extend( {}, defaults, options);


        // build destination list
        var destinationID = $(this).attr("id") + "_selected";
        var valueAttributeSelector = settings.valueAttribute;

        // Remove any existing destination lists
        $("#" + destinationID).remove();

        // Store the source list's name attribute, so that we can move it to the hidden input field (for form submission)
        var nameAttribute = $(this).attr('name');

        // Store the source List's ID attribute, so that we can use it later
        var idAttribute = $(this).attr("id");

        // Build a hidden field
        var hiddenFieldHTML = "<input type='hidden' name='" + nameAttribute + "' value='[]' />";

        // Remove the name attribute from the selected DOM element (source list)
        $(this).removeAttr('name');

        // Build destination List field
        var destField = $(this).clone(true).empty().attr("id", destinationID).get(0).outerHTML;

        // Build the new output (a table with 3 TD elements - 1) Source List, 2) Move/Remove buttons, 3) Destination List)
        var newField = "<table>" +
                            "<tr>" +
                                    "<td>" + $(this).get(0).outerHTML + "</td>" +
                                    "<td>" +
                                        "<input type='button' value='>' id='"+ $(this).attr("id") +"_add_single' /><br />" +
                                        "<input type='button' value='>>' id='" + $(this).attr("id") + "_add_all' /><br />" +
                                        "<input type='button' value='<' id='" + $(this).attr("id") + "_remove_single' /><br />" +
                                        "<input type='button' value='<<' id='" + $(this).attr("id") + "_remove_all' />" +
                                    "</td>" +
                                    "<td>" + destField + "</td>" +
                            "</tr>" +
                        "</table>";

        // Add the hidden field to this
        newField += hiddenFieldHTML;

        // Replace the source list's HTML with the new table (newField)
        $(this).replaceWith(newField);



        // Event Handlers

        // select the element
        $("#"+ idAttribute  +" > li, #"+ destinationID +" > li").on("click", function()
        {
            $("#"+ idAttribute +" > li, #"+ destinationID +" > li").attr("selected",false); //TODO: Make this a CSS attribute
            $(this).attr("selected",true);
        });

        // Add single
        $("#" + idAttribute + "_add_single").on("click", function()
        {
            addSelectedElementToHiddenElement($("#" + idAttribute + " [selected=selected]"), nameAttribute);
            addSelectedElementToList(idAttribute, destinationID);
        });

        // Add All
        $("#" + idAttribute + "_add_all").on("click", function()
        {
            addAllElementsToHiddenElement(idAttribute, nameAttribute);
            addAllElementsToList(idAttribute,destinationID);
        });

        // Remove single
        $("#" + idAttribute + "_remove_single").on("click", function()
        {
            var selectedElement = $("#" + destinationID + " [selected=selected]");

            removeSelectedElementFromHiddenElement(selectedElement, nameAttribute);
            addSelectedElementToList(destinationID, idAttribute);
        });

        // remove All
        $("#" + idAttribute + "_remove_all").on("click", function()
        {
            removeAllElementsFromHiddenElement(nameAttribute);
            addAllElementsToList(destinationID, idAttribute);
        });



            function addSelectedElementToList(sourceList,targetList)
            {
                var selected = $("#"+ sourceList +" [selected=selected]");

                if(selected.length > 0)
                {
                    selectedElement = selected.clone(true);

                    $("#" + targetList).append(selectedElement);

                    $(selected).detach();
                }
            };

            function addSelectedElementToHiddenElement(selectedElement, hiddenElementSelector)
            {
                console.log(selectedElement);

                if(selectedElement.length > 0)
                {
                    selectedElement = selectedElement.attr(valueAttributeSelector);

                    var existingValues = JSON.parse($("[name="+hiddenElementSelector+"]").val());



                    if(existingValues.indexOf(selectedElement) == -1)
                        existingValues.push(selectedElement);

                    $("[name="+hiddenElementSelector+"]").val(JSON.stringify(existingValues));
                }
            }

            function addAllElementsToList(sourceList,targetList)
            {
                var elements = $("#" + sourceList + " > li");

                if(elements.length > 0)
                {
                    elements.each(function()
                    {
                        $("#" + targetList).append($(this).clone(true));

                        $(this).detach();
                    });
                }
            };

            function addAllElementsToHiddenElement(sourceList,hiddenElementSelector)
            {
                var elements = $("#" + sourceList + " > li");

                if(elements.length > 0)
                {
                    elements.each(function()
                    {
                        addSelectedElementToHiddenElement($(this), hiddenElementSelector);

                    });
                }
            };

            function removeSelectedElementFromHiddenElement(selectedElement, hiddenElementSelector)
            {
                var existingValues = JSON.parse($("[name="+hiddenElementSelector+"]").val());

                if(existingValues.length > 0)
                {
                    var index = existingValues.indexOf(selectedElement.attr(valueAttributeSelector));

                    existingValues.splice(index, 1);

                    $("[name="+hiddenElementSelector+"]").val(JSON.stringify(existingValues));
                }
            };


            function removeAllElementsFromHiddenElement(hiddenElementSelector)
            {
                $("[name="+hiddenElementSelector+"]").val("[]");
            };

    };

}(jQuery));