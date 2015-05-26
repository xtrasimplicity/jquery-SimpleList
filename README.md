# jquery-SimpleList (beta)
Simple, format-independent JQuery Add/Remove List plugin. This plugin is still in it's early beta stages, and thus will be frequently updated. 
## Usage
Simply instanciate this plugin on any UL element, using it's id attribute, and specify each LI-element's value using the 'value'* attribute. i.e.
```
    $("#tempList").simpleList();
```
where tempList is defined as follows
```
<ul id="tempList" name="selectedListData">
    <li value='abc'>ABC</li>
    <li value='def'>DEF</li>
    <li value='ghi'>GHI</li>
  </ul>
```

* If you're unable to use the 'value' attribute for whatever reason, you can specify an alternative attribute by invoking SimpleList using:
```
    $("#tempList").simpleList({
        valueAttribute: 'AttributeNameToUse'
    });
```

Upon invocation, a hidden input element is automatically added to the DOM, such that the selected list elements are able to be passed on form submission. The hidden input element's 'name' attribute is defined by specifying a name attribute in the initial UL element.

The aforementioned example will therefore automatically instanciate a hidden input element with a name of "selectedListData".

Submitted form data can be accessed by parsing the value as JSON, i.e. 
#### PHP
```
    $submittedData = json_decode(htmlentities($_REQUEST['selectedListData'],ENT_QUOTES));
```
#### Ruby
```
    submittedData = JSON.parse(params[:selectedListData])
```

### Styling
Upon clicking on an li-element, the target li-element is marked as 'selected', and an 'sl-selected' class attribute is applied to it. In order to differentiate a selected element and an unselected element, one can apply CSS rules to the 'sl-selected' class, i.e.:
```
    .sl-selected {
        background-color: #00FFFF;
    }
```
