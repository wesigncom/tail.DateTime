/*
 |  tail.DateTime - A pure, vanilla JavaScript DateTime Picker
 |  @author        SamBrishes <https://github.com/pytesNET/tail.DateTime/>
 |                 MrGuiseppe <https://github.com/MrGuiseppe/pureJSCalendar/>
 |  @version       0.2.0 [0.1.0] - Alpha
 |
 |  @license       X11 / MIT License
 |  @copyright     Copyright © 2018 - SamBrishes, pytesNET <pytes@gmx.net>
 |                 Copyright © 2018 - MrGuiseppe <https://github.com/MrGuiseppe>
 */
;(function(w, d){
    "use strict";

    /*
     |  HELPER METHODs
     |  @since  0.1.2
     */
    var tail = {
        hasClass:       function(element, classname){
            var regex = new RegExp("(|\s+)" + classname + "(\s+|)");
            return regex.test(element.className);
        },
        addClass:       function(element, classname){
            if(!this.hasClass(element, classname)){
                element.className = (element.className.trim() + " " + classname.trim()).trim();
            }
            return element;
        },
        removeClass:    function(element, classname){
            var regex = new RegExp("(|\s+)(" + classname + ")(\s+|)");
            if(regex.test(element.className)){
                element.className = (element.className.replace(regex, "$1$3")).trim();
            }
            return element;
        }
    };

    /*
     |  CONSTRUCTOR
     |  @since  0.1.0
     */
    var tailDateTime = function(element, options){
        if(typeof(this) == "undefined" || !this.init){
            return new tailDateTime(element, options);
        }

        // Check Element
        if(typeof(element) == "string"){
            element = d.querySelector(element);
        }
        if(!element instanceof Element){
            return false;
        }

        // Get existing Instance
        if(element.hasAttribute("data-fox-calendar")){
            var calendar = element.getAttribute("data-fox-calendar");
            if(tailDateTime.instances[calendar]){
                return tailDateTime.instances[calendar];
            }
        }

        // Init Prototype Instance
        this.element = element;
        this.options = Object.assign({}, tailDateTime.defaults, (typeof(options) == "object")? options: {});
        return this.init();
    };
    tailDateTime.version = "0.2.0";
    tailDateTime.status = "alpha";
    tailDateTime.count = 0;
    tailDateTime.isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    tailDateTime.cache = {};
    tailDateTime.instances = {};

    /*
     |  STORAGE :: DEFAULT OPTIONS
     |  @since  0.1.0
     */
    tailDateTime.defaults = {
        position: "bottom",
        dateFormat: "YYYY-mm-dd",
        timeFormat: "HH:ii:ss",
        dateRange: [],
        weekStart: "SUN"
    };

    /*
     |  STORAGE :: STRINGS
     */
    tailDateTime.strings = {
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        days:   ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        shorts: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
        time:   ["Hours", "Minutes", "Seconds"],
        header: ["Select a Month", "Select a Year", "Select a Time"],
    };

    /*
     |  METHODS
     */
    tailDateTime.prototype = {
        element: null,          // The Input Element for the result
        calendar: null,         // The current calendar element
        current: {              // The current calendar data
            date: null,
            content: "",
            render: function(){
                return this.content.querySelector("tbody").innerHTML;
            }
        },
        options: {},            // The current calendar options
        view: "day",            // The current calendar view

        /*
         |  HANDLE :: INIT CALENDAR
         |  @since  0.1.0
         |  @update 0.1.2
         */
        init: function(){
            if(this.calendar){
                return this.calendar;
            }
            this.calendar = d.createElement("DIV");
            this.calendar.id = "data-fox-calendar-" + ++tailDateTime.count;
            this.calendar.className = "tail-datetime-calendar calendar-close";

            // Create Calendar Structure
            if(this.options.dateFormat){
                this.calendar.innerHTML = '' +
                    '<div class="calendar-navi">' +
                    '    <span data-fox-navi="prev" class="calendar-button button-prev"></span>' +
                    '    <span data-fox-navi="switch" class="calendar-label"></span>' +
                    '    <span data-fox-navi="next" class="calendar-button button-next"></span>' +
                    '</div>' +
                    '<div class="calendar-date"></div>' +
                    ((this.options.timeFormat)? '<div class="calendar-time">' + this.renderTime() + '</div>': '');
            } else {
                this.calendar.innerHTML = '' +
                    '<div class="calendar-navi">' +
                    '    <span data-fox-navi="check" class="calendar-button button-check"></span>' +
                    '    <span data-fox-navi="switch" class="calendar-label">' + tailDateTime.strings.header[2] + '</span>' +
                    '    <span data-fox-navi="close" class="calendar-button button-close"></span>' +
                    '</div>' +
                    ((this.options.timeFormat)? '<div class="calendar-time">' + this.renderTime() + '</div>': '');
            }

            // Set Calendar Data
            if(this.element.hasAttribute("data-fox-value")){
                this.current.date = new Date(Date.parse(this.element.getAttribute("data-fox-value")));
            } else if(this.element.value && !isNaN(new Date(Date.parse(this.element.value)))){
                this.current.date = new Date(Date.parse(this.element.value));
            } else {
                this.current.date = new Date();
            }
            if(this.options.timeFormat){
                this.calendar.querySelector(".calendar-field-h > input").value = this.current.date.getHours();
                this.calendar.querySelector(".calendar-field-m > input").value = this.current.date.getMinutes();
                this.calendar.querySelector(".calendar-field-s > input").value = this.current.date.getSeconds();
            }

            this.switchMonth(this.current.date.getMonth(), this.current.date.getFullYear());
            if(this.element.hasAttribute("data-fox-value")){
                this.selectDate();
            } else {
                this.element.setAttribute("data-fox-value", this.convertDate(this.current.date, "YYYY-mm-dd HH:ii:ss"));
            }

            // Configure Calendar Widget
            this.calendar.style.zIndex = 99;
            this.calendar.style.position = "absolute";
            this.calendar.style.visibility = "hidden";
            d.getElementsByTagName("body")[0].appendChild(this.calendar);

            // Calc Position
            var style = window.getComputedStyle(this.calendar),
                marginX = parseInt(style.marginLeft)+parseInt(style.marginRight),
                marginY = parseInt(style.marginTop)+parseInt(style.marginBottom),
                position = (function(element){
                var position = {
                    top:    element.offsetTop    || 0,
                    left:   element.offsetLeft   || 0,
                    width:  element.offsetWidth  || 0,
                    height: element.offsetHeight || 0
                };
                while(element = element.offsetParent){
                    position.top  += element.offsetTop;
                    position.left += element.offsetLeft;
                }
                return position;
            })(this.element);

            // Set Position
            switch(this.options.position){
                case "top":
                    this.calendar.style.top = position.top - (this.calendar.offsetHeight + marginY) + "px";
                    this.calendar.style.left = (position.left + (position.width / 2)) - (this.calendar.offsetWidth / 2 + marginX / 2) + "px";
                    break;
                case "left":
                    this.calendar.style.top = (position.top + position.height/2) - (this.calendar.offsetHeight / 2 + marginY) + "px";
                    this.calendar.style.left = position.left - (this.calendar.offsetWidth + marginX) + "px";
                    break;
                case "right":
                    this.calendar.style.top = (position.top + position.height/2) - (this.calendar.offsetHeight / 2 + marginY) + "px";
                    this.calendar.style.left = position.left + position.width + "px";
                    break;
                default:
                    this.calendar.style.top = position.top + position.height + "px";
                    this.calendar.style.left = (position.left + (position.width / 2)) - (this.calendar.offsetWidth / 2 + marginX / 2) + "px";
                    break;
            }
            this.calendar.style.display = "none";
            this.calendar.style.visibility = "visible";

            // Listen Header
            var self = this,
                navi = this.calendar.querySelectorAll("[data-fox-navi]");
            if(navi.length > 0){
                for(var i = 0; i < navi.length; i++){
                    navi[i].addEventListener("click", function(event){
                        var action = this.getAttribute("data-fox-navi");

                        if(self.options.dateFormat){
                            if(self.view == "month"){
                                if(action == "prev" || action == "next"){
                                    self.switchYear(action);
                                } else {
                                    self.switchView("day");
                                }
                            } else {
                                if(action == "prev" || action == "next"){
                                    self.switchMonth(action);
                                } else {
                                    self.switchView("month");
                                }
                            }
                        } else if(self.options.timeFormat){
                            if(action == "check"){
                                self.selectTime(
                                    parseInt(self.calendar.querySelector(".calendar-field-h > input").value),
                                    parseInt(self.calendar.querySelector(".calendar-field-m > input").value),
                                    parseInt(self.calendar.querySelector(".calendar-field-s > input").value)
                                );
                            }
                            self.close();
                        }
                    });
                }
            }

            // Listen Input
            this.element.addEventListener("focusin", function(event){
                self.open();
            });
            d.addEventListener("keyup", function(event){
                if(tail.hasClass(self.calendar, "calendar-open") && event.keyCode == 27){
                    self.close();
                    self.element.blur();
                }
                if(tail.hasClass(self.calendar, "calendar-open") && event.keyCode == 13){
                    if(self.options.dateFormat){
                        var day = self.calendar.children[1].querySelector("td.today") || self.calendar.children[1].querySelector("td:not(.empty)"),
                            time = !!self.options.timeFormat,
                            regex = new RegExp("(|\s+)disable(\s+|)")
                        if(!regex.test(day.className)){
                            self.selectDate(
                                self.current.year, self.current.month, parseInt(day.value),
                                (time)? parseInt(self.calendar.querySelector(".calendar-field-h > input").value): 0,
                                (time)? parseInt(self.calendar.querySelector(".calendar-field-m > input").value): 0,
                                (time)? parseInt(self.calendar.querySelector(".calendar-field-s > input").value): 0
                            );
                        }
                    } else {
                        self.selectTime(
                            parseInt(self.calendar.querySelector(".calendar-field-h > input").value),
                            parseInt(self.calendar.querySelector(".calendar-field-m > input").value),
                            parseInt(self.calendar.querySelector(".calendar-field-s > input").value)
                        );
                    }
                    self.close();
                    self.element.blur();
                }
            });
            d.addEventListener("click", function(event){
                if(!tail.hasClass(self.calendar, "calendar-open")){
                    return;
                }
                if(!self.calendar.contains(event.target) && !self.element.contains(event.target)){
                    if(event.target != self.calendar && event.target != self.element){
                        self.close();
                    }
                }
            });

            // Store Instance and Return
            this.element.setAttribute("data-fox-calendar", "fox-" + tailDateTime.count);
            tailDateTime.instances["fox-" + tailDateTime.count] = this;
            return this;
        },

        /*
         |  HANDLE :: SWITCH VIEW
         |  @since  0.1.0
         |  @update 0.1.2
         */
        switchView: function(view){
            if(!this.options.dateFormat){
                return false;
            }

            // Render View
            this.view = view;
            if(view == "month"){
                this.calendar.children[1].innerHTML = "";
                this.calendar.children[1].insertAdjacentHTML("afterbegin", this.renderMonth());
                this.calendar.querySelector(".calendar-label").innerText = this.current.date.getFullYear();
            } else {
                this.calendar.children[1].innerHTML = this.renderDay();
                this.calendar.querySelector(".calendar-label").innerText = tailDateTime.strings.months[this.current.date.getMonth()] + " " + this.current.date.getFullYear();

                // Disable on Range
                var range = this.options.dateRange,
                    year  = this.current.date.getFullYear(),
                    month = this.current.date.getMonth();
                if(range.length && range[0] instanceof Date){
                    if(year < range[0].getFullYear() || year <= range[0].getFullYear() && month <= range[0].getMonth()){
                        var disable = this.calendar.querySelectorAll("tbody td:not(.empty)");
                        for(var i = 0; i < disable.length; ++i){
                            if(parseInt(disable[i].innerText) < range[0].getDate() || month < range[0].getMonth() || year < range[0].getFullYear()){
                                disable[i].className += " disable";
                            }
                        }
                    }
                }
                if(range.length && range[1] instanceof Date){
                    if(year > range[1].getFullYear() || year >= range[1].getFullYear() && month >= range[1].getMonth()){
                        var disable = this.calendar.querySelectorAll("tbody td:not(.empty)");
                        for(var i = 0; i < disable.length; ++i){
                            if(parseInt(disable[i].innerText) > range[1].getDate() || month > range[1].getMonth() || year > range[1].getFullYear()){
                                disable[i].className += " disable";
                            }
                        }
                    }
                }
            }

            // Handle View
            var self = this;
            if(this.options.dateFormat){
                var listen = this.calendar.querySelectorAll("tbody td:not(.empty)");
                for(var i = 0; i < listen.length; i++){
                    listen[i].addEventListener("click", function(event){
                        event.preventDefault();
                        event.stopPropagation();

                        var regex = new RegExp("(|\s+)disable(\s+|)"),
                            time = !!self.options.timeFormat;
                        if(regex.test(this.className)){
                            return false;
                        }

                        if(self.view == "month"){
                            self.switchMonth(parseInt(this.getAttribute("data-fox-month")), self.current.date.getFullYear());
                        } else {
                            self.selectDate(
                                self.current.year, self.current.month, parseInt(this.innerText),
                                (time)? parseInt(self.calendar.querySelector(".calendar-field-h > input").value): 0,
                                (time)? parseInt(self.calendar.querySelector(".calendar-field-m > input").value): 0,
                                (time)? parseInt(self.calendar.querySelector(".calendar-field-s > input").value): 0
                            );
                            self.close();
                        }
                    });
                }
            }
        },

        /*
         |  RENDER :: DAY VIEW
         |  @since  0.1.0
         |  @update 0.1.2
         */
        renderDay: function(){
            var start = tailDateTime.strings.shorts.indexOf(this.options.weekStart),
                week  = tailDateTime.strings.shorts.slice(start);
                week  = week.concat(tailDateTime.strings.shorts.slice(0, start));

            return '' +
                '<table class="calendar-day">' +
                '    <thead>' +
                '        <tr>' +
                '            <th data-fox-day="' + tailDateTime.strings.shorts.indexOf(week[0]) + '">' + week[0] + '</th>' +
                '            <th data-fox-day="' + tailDateTime.strings.shorts.indexOf(week[1]) + '">' + week[1] + '</th>' +
                '            <th data-fox-day="' + tailDateTime.strings.shorts.indexOf(week[2]) + '">' + week[2] + '</th>' +
                '            <th data-fox-day="' + tailDateTime.strings.shorts.indexOf(week[3]) + '">' + week[3] + '</th>' +
                '            <th data-fox-day="' + tailDateTime.strings.shorts.indexOf(week[4]) + '">' + week[4] + '</th>' +
                '            <th data-fox-day="' + tailDateTime.strings.shorts.indexOf(week[5]) + '">' + week[5] + '</th>' +
                '            <th data-fox-day="' + tailDateTime.strings.shorts.indexOf(week[6]) + '">' + week[6] + '</th>' +
                '        </tr>' +
                '    </thead>' +
                '    <tbody>' +
                this.createCalendar(this.current.date.getMonth(), this.current.date.getFullYear()).render() +
                '   </tbody>' +
                '</table>';
        },

        /*
         |  RENDER :: MONTH VIEW
         |  @since  0.1.0
         |  @update 0.1.2
         */
        renderMonth: function(){
            var strings = tailDateTime.strings.months;

            return '' +
                '<table class="calendar-month">' +
                '    <thead>' +
                '        <tr>' +
                '           <th colspan="4">' + tailDateTime.strings.header[0] + '</th>' +
                '        </tr>' +
                '    </thead>' +
                '    <tbody>' +
                '       <tr>' +
                '           <td class="calendar-month" data-fox-month="0"><span>' + strings[0] + '</span></td>' +
                '           <td class="calendar-month" data-fox-month="1"><span>' + strings[1] + '</span></td>' +
                '           <td class="calendar-month" data-fox-month="2"><span>' + strings[2] + '</span></td>' +
                '       </tr>' +
                '       <tr>' +
                '           <td class="calendar-month" data-fox-month="3"><span>' + strings[3] + '</span></td>' +
                '           <td class="calendar-month" data-fox-month="4"><span>' + strings[4] + '</span></td>' +
                '           <td class="calendar-month" data-fox-month="5"><span>' + strings[5] + '</span></td>' +
                '       </tr>' +
                '       <tr>' +
                '           <td class="calendar-month" data-fox-month="6"><span>' + strings[6] + '</span></td>' +
                '           <td class="calendar-month" data-fox-month="7"><span>' + strings[7] + '</span></td>' +
                '           <td class="calendar-month" data-fox-month="8"><span>' + strings[8] + '</span></td>' +
                '       </tr>' +
                '       <tr>' +
                '           <td class="calendar-month" data-fox-month="9"><span>' + strings[9] + '</span></td>' +
                '           <td class="calendar-month" data-fox-month="10"><span>' + strings[10] + '</span></td>' +
                '           <td class="calendar-month" data-fox-month="11"><span>' + strings[11] + '</span></td>' +
                '       </tr>' +
                '   </tbody>' +
                '</table>';
        },

        /*
         |  RENDER :: TIME VIEW
         |  @since  0.1.0
         */
        renderTime: function(){
            return '' +
                '<div class="calendar-field calendar-field-h">' +
                '    <input type="number" value="' + new Date().getHours() + '" min="00" max="23" step="1" />' +
                '    <label>' + tailDateTime.strings.time[0] + '</label>' +
                '</div>' +
                '<div class="calendar-field calendar-field-m">' +
                '    <input type="number" value="' + new Date().getMinutes() + '" min="00" max="59" step="1" />' +
                '    <label>' + tailDateTime.strings.time[1] + '</label>' +
                '</div>' +
                '<div class="calendar-field calendar-field-s">' +
                '    <input type="number" value="' + new Date().getSeconds() + '" min="00" max="59" step="1" />' +
                '    <label>' + tailDateTime.strings.time[2] + '</label>' +
                '</div>';
        },

        /*
         |  ACTION :: OPEN CALENDAR
         |  @since  0.1.0
         |  @update 0.1.2
         */
        open: function(){
            if(!tail.hasClass(this.calendar, "calendar-close")){
                return this;
            }
            tail.removeClass(this.calendar, "calendar-close");
            tail.addClass(this.calendar, "calendar-idle");

            this.calendar.style.opacity = 0;
            this.calendar.style.display = "block";
            this.animate = setInterval(function(self){
                self.calendar.style.opacity = parseFloat(self.calendar.style.opacity) + 0.1;
                if(parseFloat(self.calendar.style.opacity) >= 1){
                    tail.removeClass(self.calendar, "calendar-idle");
                    tail.addClass(self.calendar, "calendar-open");
                    clearInterval(self.animate);
                }
            }, 10, this);
            return this;
        },

        /*
         |  ACTION :: CLOSE CALENDAR
         |  @since  0.1.0
         |  @update 0.1.2
         */
        close: function(){
            if(!tail.hasClass(this.calendar, "calendar-open")){
                return this;
            }
            tail.removeClass(this.calendar, "calendar-open");
            tail.addClass(this.calendar, "calendar-idle");

            this.animate = setInterval(function(self){
                self.calendar.style.opacity = parseFloat(self.calendar.style.opacity) - 0.1;
                if(parseFloat(self.calendar.style.opacity) <= 0){
                    tail.removeClass(self.calendar, "calendar-idle");
                    tail.addClass(self.calendar, "calendar-close");

                    self.calendar.style.display = "none";
                    clearInterval(self.animate);
                }
            }, 10, this);
            return this;
        },

        /*
         |  ACTION :: CLOSE CALENDAR
         |  @since  0.1.0
         |  @update 0.1.2
         */
        toggle: function(){
            if(tail.hasClass(this.calendar, "calendar-open")){
                return this.close();
            } else if(tail.hasClass(this.calendar, "calendar-close")){
                return this.open();
            }
            return this;
        },

        /*
         |  ACTION :: SWITCH MONTH
         |  @since  0.1.0
         |  @update 0.1.2
         */
        switchMonth: function(month, year){
            if(month == "prev"){
                this.current.date.setMonth(this.current.date.getMonth()-1)
            } else if(month == "next"){
                this.current.date.setMonth(this.current.date.getMonth()+1);
            } else {
                this.current.date.setMonth(month);
                this.current.date.setFullYear(year);
            }
            this.switchView("day");
            return this;
        },

        /*
         |  ACTION :: SWITCH YEAR
         |  @since  0.1.0
         |  @update 0.1.2
         */
        switchYear: function(year){
            if(year == "prev"){
                this.current.date.setFullYear(this.current.date.getFullYear()-1);
            } else if(year == "next"){
                this.current.date.setFullYear(this.current.date.getFullYear()+1);
            } else {
                this.current.date.setFullYear(year);
            }
            this.switchView("month");
            return this;
        },

        /*
         |  ACTION :: SELECT A DATE
         |  @since  0.1.0
         |  @update 0.1.2
         */
        selectDate: function(Y, M, D, h, i, s){
            var n = new Date();

            // Format
            var f = [
                (this.options.dateFormat)? this.options.dateFormat: "",
                (this.options.timeFormat)? this.options.timeFormat: "",
            ].join(" ").trim();

            // Date
            var date = new Date(
                ((Y)? Y: ((Y == undefined)? this.current.date.getFullYear(): n.getFullYear())),
                ((M)? M: ((M == undefined)? this.current.date.getMonth(): n.getMonth())),
                ((D)? D: ((D == undefined)? this.current.date.getDate(): n.getDate())),
                ((h)? h: (h == undefined)? this.current.date.getHours(): 0),
                ((i)? i: (i == undefined)? this.current.date.getMinutes(): 0),
                ((s)? s: (s == undefined)? this.current.date.getSeconds(): 0),
            );

            // Value
            this.element.value = this.convertDate(date, f);
            this.element.setAttribute("data-fox-value", this.convertDate(date, "YYYY-mm-dd HH:ii:ss"));
            return this;
        },
        selectTime: function(h, i, s){
            return this.selectDate(false, false, false, h, i, s);
        },

        /*
         |  ACTION :: SELECT CALENDAR
         |  @since  0.1.0
         |  @update 0.1.2
         */
        createCalendar: function(month, year){
            var day = 1, haveDays = true,
                startDay = new Date(year, month, day).getDay(),
                daysInMonths = [31, (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
                calendar = [];

            // Calc start Day
            startDay = startDay-tailDateTime.strings.shorts.indexOf(this.options.weekStart);
            if(startDay < 0){
                startDay = 7 + startDay;
            }

            // Cache
            if(tailDateTime.cache[this.options.weekStart + "_" + year] && !tailDateTime.isIE11){
                if(tailDateTime.cache[this.options.weekStart + "_" + year][month]){
                    return tailDateTime.cache[this.options.weekStart + "_" + year][month];
                }
            } else {
                tailDateTime.cache[this.options.weekStart + "_" + year] = {};
            }

            // Calculate
            var i = 0;
            while(haveDays){
                calendar[i] = [];
                for(var j = 0; j < 7; j++){
                    if(i === 0){
                        if(j === startDay){
                            calendar[i][j] = day++;
                            startDay++;
                        }
                    } else if(day <= daysInMonths[month]){
                        calendar[i][j] = day++;
                    } else {
                        calendar[i][j] = "";
                        haveDays = false;
                    }
                    if(day > daysInMonths[month]){
                        haveDays = false;
                    }
                }
                i++;
            }

            // Render
            for(var i = 0; i < calendar.length; i++){
                calendar[i] = '<tr><td class="calendar-day">' + calendar[i].join('</td><td class="calendar-day">') + '</td></tr>';
            }
            var render = document.createElement("table");
                render.className = "calendar-current";
                render.innerHTML = calendar.join("");

            // Empty Fields
            var empty  = render.querySelectorAll("td:empty");
            for(var i = 0; i < empty.length; ++i){
                empty[i].className += " empty";
            }

            // Today Field
            if(month === new Date().getMonth()){
                var today = Array.prototype.slice.call(render.querySelectorAll("td"));
                today.forEach(function(current, index, array){
                    if(current.innerHTML === new Date().getDate().toString()){
                        current.className += " today";
                    }
                });
            }

            // Return
            this.current.date.setMonth(month);
            this.current.date.setFullYear(year);
            this.current = tailDateTime.cache[this.options.weekStart + "_" + year][month] = Object.assign({}, this.current, {
                content: render
            });
            return tailDateTime.cache[this.options.weekStart + "_" + year][month];
        },

        /*
         |  CONVERT DATE
         |  @since  0.1.0
         */
        convertDate: function(inDate, format){
            var dateObject = {
                H: String("00" + inDate.getHours()).toString().slice(-2),
                G: function(hours){
                    return (hours % 12)? hours % 12: 12;
                }(inDate.getHours()),
                A: inDate.getHours() >= 12? "PM": "AM",
                a: inDate.getHours() >= 12? "pm": "am",
                i: String("00" + inDate.getMinutes()).toString().slice(-2),
                s: String("00" + inDate.getSeconds()).toString().slice(-2),

                Y: inDate.getFullYear(),
                y: parseInt(inDate.getFullYear().toString().slice(2)),
                m: String("00" + (inDate.getMonth() + 1)).toString().slice(-2),
                M: tailDateTime.strings.months[inDate.getMonth()].slice(0, 3),
                F: tailDateTime.strings.months[inDate.getMonth()],
                d: String("00" + inDate.getDate()).toString().slice(-2),
                D: tailDateTime.strings.days[inDate.getDay()],
                l: tailDateTime.strings.shorts[inDate.getDay()].toLowerCase()
            };

            var regex = new RegExp("(H{1,2}|G{1,2}|i{1,2}|s{1,2}|Y{2,4}|y{2}|m{1,2}|d{1,2})", "g");
                format = format.replace(regex, function(token){
                    var datePart = dateObject[token.slice(-1)].toString(),
                        tokenlen = token.length, zeroPad

                    if(tokenlen == 4 || tokenlen == 2){
                        return datePart.slice(-Math.abs(tokenlen));
                    }
                    if(tokenlen == 1 && datePart[0] == "0"){
                        return datePart.slice(-1)
                    }
                    return datePart;
                });
                format = format.replace(/(A|a|M|F|D|l)/g, function(token){
                    return dateObject[token];
                });
            return format;
        }
    }

    // Assign to Window
    if(typeof(w.tail) == "undefined"){
        w.tail = {};
    }
    w.tail.DateTime = tailDateTime;
})(window, document);
