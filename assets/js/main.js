require([
    "prism.min", "menuspy.min", "tail.demo", "tail.select.min", "source/tail.datetime",
    "langs/tail.datetime-all"
], function(prism, menu, website, select, datetime, languages){
    var d = document, cur = new Date(), holder = [];
    var renderSource = function(el, code){
        el.className = "language-javascript line-numbers";
        el.innerHTML = "<code>" + code + "</code>";
        Prism.highlightAllUnder(el.parentElement);
    }
    languages(datetime);

    // Welcome Calendars
    datetime(".datetime-calendar");

    // General Actions
    d.querySelector("select#change-design").addEventListener("change", function(){
        if(this.value == "harx"){
            for(var l = holder.length, i = 0; i < l; i++){
                holder[i].config("classNames", "theme-" + this.value);
            }
            d.querySelector("select#change-color").options.selectedIndex = 4;
        } else {
            for(var l = holder.length, i = 0; i < l; i++){
                holder[i].config("classNames", "");
            }
            d.querySelector("select#change-color").options.selectedIndex = 0;
        }
    });
    d.querySelector("select#change-color").addEventListener("change", function(){
        if(d.querySelector("select#change-design").value == "harx"){
            var value = "theme-harx theme-" + this.value;
        } else {
            var value = "theme-" + this.value;
        }
        for(var l = holder.length, i = 0; i < l; i++){
            holder[i].config("classNames", value);
        }
    });
    d.querySelector("select#change-locale").addEventListener("change", function(){
        for(var l = holder.length, i = 0; i < l; i++){
            holder[i].config("locale", this.value);
        }
    });
    d.querySelector("select#change-design").options.selectedIndex = 0;
    d.querySelector("select#change-color").options.selectedIndex = 0;
    d.querySelector("select#change-locale").options.selectedIndex = 0;

    // Helper
    var dateHelper = datetime(".datetime-helper", {
        timeFormat: false,
        position: "right"
    });
    holder = holder.concat(dateHelper);

    // DateTime Positions
    var dateFields = datetime(".datetime-field");
    holder = holder.concat(dateFields);

    /*
     |  FIRST DEMONSTRATION
     */
    var demo1 = datetime("#datetime-1", {
        position: "#datetime-1-holder",
        startOpen: true,
        stayOpen: true
    });
    holder.push(demo1);

    // Settings
    var form = d.querySelectorAll("#datetime-1-settings input, #datetime-1-settings select");
    for(var l = form.length, i = 0; i < l; i++){
        form[i].addEventListener("change", function(){
            var value = (this.type == "checkbox")? this.checked: this.value;
            switch(this.name){
                case "disable-picker":
                    if(value == 0){
                        demo1.config({dateFormat: "YYYY-mm-dd", timeFormat: "HH:ii:ss"});
                    } else if(value == 1){
                        demo1.config({dateFormat: false, timeFormat: "HH:ii:ss"});
                    } else if(value == 2){
                        demo1.config({dateFormat: "YYYY-mm-dd", timeFormat: false});
                    }
                    break;
                case "today":
                    demo1.config("today", value);
                    break;
                case "weekstart":
                    demo1.config("weekStart", value);
                    break;
            }

            // Render Source Code
            var render = "", arr = ["dateFormat", "timeFormat", "today", "weekStart"];
            for(var i = 0; i < 4; i++){
                if(demo1.config(arr[i]) != datetime.defaults[arr[i]]){
                    render += "    " + arr[i] + ": " + demo1.config(arr[i]) + ",\n";
                }
            }
            renderSource(d.querySelector("#datetime-1-source"),
                "datetime(\"#datetime-1\", {\n"
              + ((render.length > 0)? render: "    /* No Custom Settings Defined */\n")
              + "\n    // Demonstration Values\n"
              + "    position: \"#datetime-1-holder\",    // Appends the Calendar to this Container\n"
              + "    startOpen: true,                   // Directly opens the Calendar Popup\n"
              + "    stayOpen: true                     // Keeps the Calendar Popup Open\n"
              + "});"
            );
        });
        switch(form[i].name){
            case "disable-picker":
                form[i].checked = (form[i].value == 0);
                break;
            case "today":
                form[i].checked = true;
                break;
            case "weekstart":
                form[i].options[0].selected = true;
                break;
        }
    }

    /*
     |  SECOND DEMONSTRATION
     */
    var demo2 = datetime("#datetime-2", {
        position: "#datetime-2-holder",
        startOpen: true,
        stayOpen: true
    });
    holder.push(demo2);

    // Settings
    var tailSelect = select("#range-days", {
        width: "200px",
        placeholder: "Select the WeekDays"
    });
    var form = d.querySelectorAll("#datetime-2-settings input"),
        handle = function(event){
            if(this.type == "submit" || this.name == "add-range"){
                event.preventDefault();
            }
            switch(this.name){
                case "blacklist":
                    demo2.config("dateBlacklist", !!parseInt(this.value));
                    if(this.value == "0"){
                        d.querySelector("#datestart").disabled = true;
                        d.querySelector("#dateend").disabled = true;
                    } else {
                        d.querySelector("#datestart").disabled = false;
                        d.querySelector("#dateend").disabled = false;
                    }
                    break;
                case "datestart":
                    demo2.config("dateStart", this.value? parseInt(this.getAttribute("data-value")): null);
                    break;
                case "dateend":
                    demo2.config("dateEnd", this.value? parseInt(this.getAttribute("data-value")): null);
                    break;
                case "add-range":
                    var start = d.querySelector("#range-start"),
                        end   = d.querySelector("#range-end"),
                        days  = d.querySelector("#range-days");
                        time1 = (start.value.length > 0)? parseInt(start.getAttribute("data-value")): Infinity;
                        time2 = (end.value.length > 0)? parseInt(end.getAttribute("data-value")): Infinity;
                        select= function(options){
                            for(var r = [], l = options.length, i = 0; i < l; i++){
                                if(options[i].selected){
                                    r.push(options[i].value);
                                }
                            }
                            return r;
                        }(days.options);

                    // Set Default
                    start.value = ""; end.value = "";

                    // Add Range
                    if(time1){
                        time2 = (!time2)? time1: time2;
                        var conf = demo2.config("dateRanges");
                            conf = [{ start: time1, end: time2, days: select }].concat(conf);
                        demo2.config("dateRanges", conf, false);
                    }
                    break;
            }

            // Render Source Code
            var render = "", info = (demo2.config("dateBlacklist") == false)? "    /* Will be ignored during the 'Whitelist' mode! */": "";
            if(demo2.config("dateStart") > 0){
                render += "    dateStart: " + demo2.config("dateStart") + "," + info + "\n";
            }
            if(demo2.config("dateEnd") < 9999999999999){
                render += "    dateEnd: " + demo2.config("dateEnd") + ",  " + info + "\n";
            }
            if(demo2.config("dateBlacklist") == false){
                render += "    dateBlacklist: " + demo2.config("dateBlacklist") + ",\n";
            }
            if(demo2.config("dateRanges").length > 0){
                render += "    dateRanges: [\n";
                for(var r = demo2.config("dateRanges"), i = 0; i < r.length; i++){
                    render += "        {\n";
                    render += "            start: " + r[i].start + ",\n";
                    render += "            end: " + r[i].end + ",\n";
                    render += "            days: " + ((r[i].days.length == 7)? "true": (function(days){
                        for(var r = "[", l = days.length, i = 0; i < l; i++){
                            r += "\"" + (["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][days[i]]) + "\", ";
                        }
                        return r.slice(0, r.length-2) + "]";
                    }(r[i].days))) + "\n";
                    render += "        },\n";
                }
                render  = render.slice(0, render.length-2)+"\n";
                render += "    ],\n";
            }
            renderSource(d.querySelector("#datetime-2-source"),
                "datetime(\"#datetime-2\", {\n"
              + ((render.length > 0)? render: "    /* No Custom Settings Defined */\n")
              + "\n    // Demonstration Values\n"
              + "    position: \"#datetime-2-holder\",    // Appends the Calendar to this Container\n"
              + "    startOpen: true,                   // Directly opens the Calendar Popup\n"
              + "    stayOpen: true                     // Keeps the Calendar Popup Open\n"
              + "});"
            );
        };
    for(var l = form.length, i = 0; i < l; i++){
        form[i].addEventListener("change", handle);
        form[i].addEventListener("input", handle);
        form[i].addEventListener("click", handle);
        switch(form[i].name){
            case "blacklist":
                form[i].checked = (form[i].value == 1);
                break;
            case "datestart":
            case "dateend":
            case "range[start]":
            case "range[end]":
                form[i].value = "";
                break;
        }
    }
    form[0].parentElement.addEventListener("submit", function(e){ e.preventDefault(); });

    /*
     |  THIRD DEMONSTRATION
     */
    var demo3 = datetime("#datetime-3", {
        position: "#datetime-3-holder",
        startOpen: true,
        stayOpen: true
    });
    holder.push(demo3);

    var form = d.querySelectorAll("#datetime-3-settings input"),
        handle = function(event){
            if(this.type == "submit" || this.name == "add-range"){
                event.preventDefault();
            }
            switch(this.name){
                case "animate":
                    demo3.config("animate", !!parseInt(this.value));
                    break;
                case "add-tooltip":
                    var start = d.querySelector("#tooltip-start"),
                        end   = d.querySelector("#tooltip-end"),
                        text  = d.querySelector("#tooltip-text"),
                        color = d.querySelector("#tooltip-color"),
                        time1 = (start.value.length > 0)? parseInt(start.getAttribute("data-value")): false,
                        time2 = (end.value.length > 0)? parseInt(end.getAttribute("data-value")): time1;

                    // Add Range
                    if(time1){
                        time2 = (!time2)? time1: time2;
                        var conf = demo3.config("tooltips");
                            conf = [{
                                date: (time1 !== time2)? [time1, time2]: time1,
                                text: (text.value || "Tooltip"),
                                color: (color.value || null)
                            }].concat(conf);
                        demo3.config("tooltips", conf, false);
                    }
                    start.value = ""; end.value = ""; text.value = ""; color.value = "";
                    break;
            }

            // Render Source
            var render = "";
            if(demo3.config("animate") == false){
                render += "    animate: " + demo3.config("animate") + ",\n";
            }
            if(demo3.config("tooltips").length > 0){
                render += "    tooltips: [\n";
                for(var r = demo3.config("tooltips"), i = 0; i < r.length; i++){
                    render += "        {\n";
                    render += "            date: " + ((r[i].date instanceof Array)? "[" + r[i].date[0] + ", " + r[i].date[1] + "]": r[i].date) + ",\n";
                    render += "            text: \"" + r[i].text + "\"" + ((r[i].color != "inherit")? ",\n": "\n");
                    if(r[i].color != "inherit"){
                        render += "            color: \"" + r[i].color + "\"\n";
                    }
                    render += "        },\n";
                }
                render  = render.slice(0, render.length-2)+"\n";
                render += "    ],\n";
            }
            renderSource(d.querySelector("#datetime-3-source"),
                "datetime(\"#datetime-3\", {\n"
              + ((render.length > 0)? render: "    /* No Custom Settings Defined */\n")
              + "\n    // Demonstration Values\n"
              + "    position: \"#datetime-3-holder\",    // Appends the Calendar to this Container\n"
              + "    startOpen: true,                   // Directly opens the Calendar Popup\n"
              + "    stayOpen: true                     // Keeps the Calendar Popup Open\n"
              + "});"
            );
        };
    for(var l = form.length, i = 0; i < l; i++){
        form[i].addEventListener("change", handle);
        form[i].addEventListener("input", handle);
        form[i].addEventListener("click", handle);
        switch(form[i].name){
            case "animate":
                form[i].checked = (form[i].value == "1");
                break;
            case "add-tooltip":
                break;
            default:
                form[i].value = "";
                break;
        }
    }
    form[0].parentElement.addEventListener("submit", function(e){ e.preventDefault(); });
});
