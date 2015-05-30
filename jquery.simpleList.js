(function($) {
    $.fn.simpleList = function( options ) {

        var defaults = $.extend({
            valueAttribute   : 'value'
        });

        var settings = $.extend( {}, defaults, options);

        // build destination list
        var destinationID = $(this).attr("id") + "_selected";
        var valueAttributeSelector = settings.valueAttribute;

        // If re-initializing SimpleList on a single selector
        if($("#" + destinationID).length > 0)
        {
            // before we remove existing elements, let's move the selected items *back* to the source list
            $("#" + $(this).attr("id") + "_remove_all").click();

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

        // Store the source List's ID attribute, so that we can use it later
        var idAttribute = $(this).attr("id");

        // Build a hidden field
        var hiddenFieldHTML = "<input type='hidden' parentID='" + idAttribute + "' name='" + nameAttribute + "' value='[]' />";

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
            $("#"+ idAttribute +" > li, #"+ destinationID +" > li").removeClass("sl-selected");
            $(this).addClass("sl-selected")
        });

        // Add single
        $("#" + idAttribute + "_add_single").on("click", function()
        {
            addSelectedElementToHiddenElement(idAttribute, nameAttribute);
            addSelectedElementToList(idAttribute, destinationID);

            // unselect selected element
            $(".sl-selected").removeClass("sl-selected");
        });

        // Add All
        $("#" + idAttribute + "_add_all").on("click", function()
        {
            addAllElementsToHiddenElement(idAttribute, nameAttribute);
            addAllElementsToList(idAttribute,destinationID);

            // unselect selected element
            $(".sl-selected").removeClass("sl-selected");
        });

        // Remove single
        $("#" + idAttribute + "_remove_single").on("click", function()
        {
            var selectedElement = $("#" + destinationID + " [selected=selected]");

            removeSelectedElementFromHiddenElement(selectedElement, nameAttribute);
            addSelectedElementToList(destinationID, idAttribute);

            // unselect selected element
            $(".sl-selected").removeClass("sl-selected");
        });

        // remove All
        $("#" + idAttribute + "_remove_all").on("click", function()
        {
            removeAllElementsFromHiddenElement(nameAttribute);
            addAllElementsToList(destinationID, idAttribute);

            // unselect selected element
            $(".sl-selected").removeClass("sl-selected");
        });

        function addSelectedElementToList(sourceList,targetList)
        {
            var selected = $("#"+ sourceList +" .sl-selected");

            if(selected.length > 0)
            {
                selectedElement = selected.clone(true);

                $("#" + targetList).append(selectedElement);

                $(selected).detach();
            }
        };

        function addSelectedElementToHiddenElement(selectedElement, hiddenElementSelector)
        {
            var selectedElement = $("#" + selectedElement + " .sl-selected");

            addElementToHiddenElement(selectedElement, hiddenElementSelector);
        }

        function addElementToHiddenElement(el, hiddenElSelector)
        {
            if(el.length > 0)
            {
                elValue = el.attr(valueAttributeSelector);

                var existingValues = JSON.parse($("[name=" + hiddenElSelector +"]").val());

                if(existingValues.indexOf(elValue) == -1)
                    existingValues.push(elValue);

                $("[name=" + hiddenElSelector +"]").val(JSON.stringify(existingValues));
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
                    addElementToHiddenElement($(this), hiddenElementSelector);
                    //addSelectedElementToHiddenElement($(this), hiddenElementSelector);
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