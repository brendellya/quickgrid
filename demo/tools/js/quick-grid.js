/**
 * Quick Guide v 0.1.0
 * Created by brendellya on 12/27/13.
 */
var gridSettings = gridSettings || {};

//todo enable domain check
(function ($, gs) {
  "use strict";

  var qGrid;
  qGrid = {
    minColums: 1,
    maxColums: 6,
    defaultColor: "red",
    defaultOpacity: "0.3",
    windowHeight: (document.documentElement && document.documentElement.clientHeight) ? document.documentElement.clientHeight : window.innerHeight,

    /**
     * settingsObj holds user settings
     * if cookies are present, else uses default above
     */
    settingsObj: {},

    /**
     * Quick Grid containters (grid, settings)
     * to be added to the DOM
     */
    gridEle: $("<div />", { id: "qg-guide"}),
    settingsEle: $("<div />", { id: "qg-settings", "class": "toggle-on" }),

    /**
     * Grid Settings (Form)
     * Default values for creating the setting form
     */
    formFields: {
      fColumns: { type: "text", name: "columns", value: "6"},
      fArrange: { type: "select", name: "arrange", value: {back: -1, front: 100000}},
      fColor: { type: "text", name: "color", value: "red"},
      fOpacity: { type: "text", name: "opacity", value: "0.3"}
    },
    //Todo include form help text
    helpMsg: {
      fColumns: "Enter a single value (multiple of 6) or comma separated values",
      fArrange: "Toggle between front or back",
      fColor: "Enter a CSS color value (color or hex)",
      fOpacity: "Enter a CSS opacity value (0 - 1)"
    },
    errorMsg: {
      tooShort: "Oops too short - multiple values must total 6",
      tooLong: "Oops too long - multiple values cannot exceed a total of 6",
      invalid: "Oh no...single values must be multiples of 6"
    },

    /**
     * Cookie Functions
     * setCookie() readCookie() doCookieCheck()
     * defaults to session cookie, current domain
     *
     */
    setCookie: function (name, value, seconds, domain) {
      var cookieName = name + "=" + JSON.stringify(value);
      var cookieExpiry;
      var cookiePath;
      var cookieDomain;

      if(seconds !== ""){
        var date = new Date();
        date.setTime(date.getTime() + seconds * 1000);
        seconds = date.toGMTString();
      }
      if(domain !== ""){
        domain = "." + domain;
      }
      cookieExpiry = ";expires=" +seconds;
      cookiePath = ";path=/";
      cookieDomain = ";domain=" + domain;

      document.cookie = cookieName + cookieExpiry + cookiePath + cookieDomain;
    },
    readCookie: function (cookieName) {
      var allCookies = "" + document.cookie,
        index,
        index1;

      index = allCookies.indexOf(cookieName);
      if (index === -1 || cookieName === "") return "";

      index1 = allCookies.indexOf(";", index);
      if (index1 === -1) index1 = allCookies.length;

      return decodeURI(allCookies.substring(index + cookieName.length + 1, index1));
    },
    doCookieCheck: function (cookieName) {
      if(document.cookie.indexOf(cookieName) > -1) return true;
      return false;
    },

    /**
     * getScrollHeight() returns true window height
     * based on page content
     *
     * @returns {integer}
     */
    getScrollHeight: function () { // return the true height of window's content
      return (qGrid.windowHeight > document.body.parentNode.scrollHeight) ? qGrid.windowHeight : document.body.parentNode.scrollHeight;
    },

    /**
     * displayError() creates an error message
     * adds error to DOM, then fades out
     *
     * @param err
     */
     //Todo fix double post
    displayError: function (err) {
      var _err = $("<span />", { id: "qg-error", "class": "error", text: err });

      _err.prependTo("body").fadeIn("fast", function () {
        var _this = $(this);
        setTimeout(function () { _this.fadeOut("slow").remove(); }, 3000);
      });
    },

    /**
     * init() initializes the grid, and writes setting form
     * checks for cookies, assign to qGrid.settingsObj
     */
    init: function () {
      if (qGrid.doCookieCheck("quick-grid")) {
        qGrid.settingsObj = JSON.parse(qGrid.readCookie("quick-grid"));
      }
      qGrid.initGrid();
      qGrid.writeForm();
    },

    /**
     * getColumnTotal() returns total column value
     *
     * @param arr
     * @returns {number}
     */
    getColumnTotal: function (arr) {
      var result = 0;
      for (var i = 0; i < arr.length; i++) {
        result += parseInt(arr[i], 10);
      }
      return result;
    },

    /**
     *createColumnArray() - returns array with column widths
     * converts single values into a new array
     *
     * @param arr
     * @returns {array}
     */
    createColumnArray: function (arr) {
      var result = [],
        valid,
        divisor;

      //missing value - set to default (6)
      if (arr.length < 1) arr.push(qGrid.maxColums);

      //single value - convert to column array (ex 2 = [3,3])
      if (arr.length === 1) {

        //test if multiple of 6
        valid = (qGrid.maxColums % arr[0] === 0) ? arr[0] : false;

        if (valid) {

          //divide to calculate width of columns, create array
          divisor = qGrid.maxColums / valid;
          for (var x = 0; x < valid; x++) {
            result.push(divisor);
          }
          return result;

          //!valid - return error msg
        } else {
          qGrid.displayError(qGrid.errorMsg.invalid);
          return false;
        }

      //multiple value - return
      } else {
        return arr;
      }
    },

    /**
     * initGrid() evaluates column values
     * displays grid or errors
     */
    initGrid: function () {
      var cArr = qGrid.settingsObj.columns || [qGrid.maxColums],
        gridArr,
        colVal,
        err;

      //change column array values from string to int, rounded down
      cArr = cArr.map(Math.floor);

      //create new array with column widths
      gridArr = qGrid.createColumnArray(cArr);

      if(gridArr){
        //calculate total array value
        colVal = qGrid.getColumnTotal(gridArr);

        if (colVal === qGrid.maxColums) {
          qGrid.writeGrid(gridArr);
        } else {
          err = (colVal < qGrid.maxColums)? qGrid.errorMsg.tooShort : qGrid.errorMsg.tooLong;
          qGrid.displayError(err);
        }
      }
    },

    /**
     * writeGrid() writes grid markup to DOM
     *
     * @param arr
     */
    writeGrid: function (arr) {
      var rColor = qGrid.settingsObj.color || qGrid.defaultColor,
        rOpacity = qGrid.settingsObj.opacity || qGrid.defaultOpacity,
        rIndex = qGrid.settingsObj.arrange || "-1",
        _row = $("<div />", { "class": "row" });

      //create new column element and append to _row
      for (var i = 0; i < arr.length; i++) {
        $("<div />", { "class": "c" + arr[i], css: {
          height: qGrid.getScrollHeight() + "px",
          background: rColor,
          opacity: rOpacity
        }
        }).appendTo(_row);
      }

      //write new grid
      qGrid.gridEle.html(_row).prependTo("body").css({ zIndex: rIndex });

      $(window).resize(function(){
        //reset height and resize height on window change
        $("#qg-guide .row > *").css({ height: 0 }).css({ height: qGrid.getScrollHeight() +"px" });
      });
    },

    /**
     * writeForm() writes settings to DOM
     * checks for user setting if set
     */
    writeForm: function() {
      var _toggle = $("<a />", { "class": "btn-toggle", href: "#", text: "Quick Grid",
        click: function (e) { qGrid.toggleForm(); e.preventDefault(); }
      });
      var _submit = $("<input />", { type: "submit", name: "submit", value: "Set",
        click: function (e) { qGrid.saveSettings(); e.preventDefault(); }
      });

      //Create form element
      var _form = $("<form />", { "class": "form" }),
        _formRow,
        _label,
        _input,
        _help;

      //loop thru elements and create a new _formRow
      for(var x in qGrid.formFields) {
        var fname = qGrid.formFields[x].name;
        var ftype = qGrid.formFields[x].type;
        var fvalue = qGrid.formFields[x].value;

        _label = $("<label />", { text: fname });
        //unused for the moment, can be appended to formRow
        _help = $("<span />", { "class": "help", text: "?"}).append("<strong>"+qGrid.helpMsg[x]+ "</strong>");

        //form inputs
        switch (ftype){
        case "select":
          _input = $("<select />", { name: fname });
          for(var v in fvalue) {
            $("<option />", { value: fvalue[v], text: v}).appendTo(_input);
          }
          break;

        case "text":
          _input = $("<input />", { type: "text", name: fname, value: fvalue });
          break;
        }

        //create new row, append _label, _input and add to form element
        _formRow = $("<p />", { "class": fname }).append(_label).append(_input);
        _form.append(_formRow);
      }

      _form.append(_submit);
      qGrid.settingsEle.html(_form).prepend(_toggle).prependTo("body");

      //overwrite default values if user settings are present
      if (qGrid.settingsObj.columns !== undefined) qGrid.refreshForm();
      if (qGrid.settingsObj.setting === "close") qGrid.toggleForm();
    },

    toggleForm: function() {
      var thisForm = $("#qg-settings"),
        thisStatus = thisForm.attr("class");

      //if open, close
      if(thisStatus.indexOf("on") > -1){
        thisForm.attr("class", "toggle-off");
        qGrid.settingsObj.setting   = "close";
      } else {
        thisForm.attr("class", "toggle-on");
        qGrid.settingsObj.setting   = "open";
      }
      qGrid.setCookie("quick-grid", qGrid.settingsObj, "", "");
    },

    /**
     * parseFormValues() formats form values into a new object
     *
     * @returns {object}
     */
    parseFormValues: function() {
      var gridForm = $("#qg-settings form"),
        vals = gridForm.serializeArray(),
        cookieObj = {};

      for (var x in vals) {
        var fname = vals[x].name;
        var fval = vals[x].value;

        //evaluate columns, remove spaces, and create array
        if (fname === "columns") {
          cookieObj[fname] = (fname.length > 1) ? fval.replace(/\s+/g,"").split(",") : [fval];
        } else {
          cookieObj[fname] = fval;
        }
      }
      return cookieObj;
    },

    /**
     * refreshForm() iterates over settingsObj
     * refresh form with user settings
     */
    refreshForm: function () {
      for (var f in qGrid.settingsObj) {
        $("#qg-settings :input[name=" + f + "]").val(qGrid.settingsObj[f]);
      }
    },

    /**
     * saveSettings() saves settings on form submit
     * creates new session cookie, redraws grid
     */
    saveSettings: function () {
      qGrid.settingsObj = qGrid.parseFormValues();
      qGrid.setCookie("quick-grid", qGrid.settingsObj, "", "");

      qGrid.initGrid();
    }
  };

  //jQuery writes grid to the DOM
  $(document).ready(function () {
    if (gs.isDebug) qGrid.init();
  });

})(jQuery, gridSettings);
