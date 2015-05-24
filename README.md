# jquery-SimpleList
Simple, format-independent JQuery Add/Remove List framework
## Usage
Simply instanciate this framework on any UL element, using it's id attribute, and specify each LI-element's value using the 'value' attribute. i.e.
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

