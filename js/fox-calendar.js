/*
 |  FoxCalendar     A fork of the pureJSCalendar script!
 |  @version        0.1.1 - Alpha
 |
 |  @author         SamBrishes <https://github.com/MrGuiseppe/FoxCalendar/>
 |                  MrGuiseppe <https://github.com/MrGuiseppe/pureJSCalendar/>
 |  @license        MIT / X11 License
 |  @copyright      Copyright (c) 2018 - SamBrishes <https://github.com/SamBrishes>
 |                  Copyright (c) 2018 - MrGuiseppe <https://github.com/MrGuiseppe>
 */
;(function(w, d){
    "use strict";

    /*
     |  CONSTRUCTOR
     |  @since  0.1.0
     */
    var FoxCalendar = function(element, options){
        if(this == undefined){
            return new FoxCalendar(element, options);
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
            if(FoxCalendar.instances[calendar]){
                return FoxCalendar.instances[calendar];
            }
        }

        // Init Prototype Instance
        this.element = element;
        this.options = Object.assign({}, FoxCalendar.defaults, (typeof(options) == "object")? options: {});
        return this.init();
    };
    FoxCalendar.version = "0.1.1";
    FoxCalendar.status = "alpha";
    FoxCalendar.count = 0;
    FoxCalendar.isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    FoxCalendar.cache = {};
    FoxCalendar.instances = {};

    /*
     |  STORAGE :: DEFAULT OPTIONS
     |  @since  0.1.0
     */
    FoxCalendar.defaults = {
        position:       "bottom",
        dateFormat:     "YYYY-mm-dd",
        timeFormat:     "HH:ii:ss",
        dateRange:      [],
        weekStart:      "SUN"
    };

    /*
     |  STORAGE :: STRINGS
     */
    FoxCalendar.strings = {
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        days:   ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        shorts: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
        time:   ["Hours", "Minutes", "Seconds"],
        header: ["Select a Month", "Select a Year", "Select a Time"],
    };

    /*
     |  METHODS
     */
    FoxCalendar.prototype = {
        element:        null,       // The Input Element for the result
        calendar:       null,       // The current calendar element
        current:        {           // The current calendar data
            day:        0,
            month:      0,
            year:       0,
            content:    0,
            render:     function(){
                return this.content.querySelector("tbody").innerHTML;
            }
        },
        options:        {},         // The current calendar options
        view:           "day",      // The current calendar view

        /*
         |  HANDLE :: INIT CALENDAR
         |  @since  0.1.0
         |  @update 0.1.1
         */
        init:           function(){
            if(this.calendar){
                return this.calendar;
            }
            this.calendar = d.createElement("DIV");
            this.calendar.id = "data-fox-calendar-" + ++FoxCalendar.count;
            this.calendar.className = "fox-js-calendar";
            this.calendar.setAttribute("data-fox-calendar", "close");

            // Create Calendar Structure
            if(this.options.dateFormat){
                this.calendar.innerHTML = '' +
                    '<div class="calendar-navi">' +
                    '    <span data-fox-navi="prev" class="calendar-button button-prev">&lsaquo;</span>' +
                    '    <span data-fox-navi="switch" class="calendar-label"></span>' +
                    '    <span data-fox-navi="next" class="calendar-button button-next">&rsaquo;</span>' +
                    '</div>' +
                    '<div class="calendar-date"></div>' +
                    ((this.options.timeFormat)? '<div class="calendar-time">' + this.renderTime() + '</div>': '');
            } else {
                this.calendar.innerHTML = '' +
                    '<div class="calendar-navi">' +
                    '    <span data-fox-navi="check" class="calendar-button button-check"></span>' +
                    '    <span data-fox-navi="switch" class="calendar-label">' + FoxCalendar.strings.header[2] + '</span>' +
                    '    <span data-fox-navi="close" class="calendar-button button-close"></span>' +
                    '</div>' +
                    ((this.options.timeFormat)? '<div class="calendar-time">' + this.renderTime() + '</div>': '');
            }

            // Set Calendar Data
            var setDefault = new Date(Date.parse(this.element.value));
            if(setDefault && !isNaN(setDefault)){
                this.current.year = setDefault.getFullYear();
                this.current.month = setDefault.getMonth();
                this.current.day = setDefault.getDate();
                if(this.options.timeFormat){
                    this.calendar.querySelector(".calendar-field-h > input").value = setDefault.getHours();
                    this.calendar.querySelector(".calendar-field-m > input").value = setDefault.getMinutes();
                    this.calendar.querySelector(".calendar-field-s > input").value = setDefault.getSeconds();
                }
            } else {
                this.current.year = new Date().getFullYear();
                this.current.month = new Date().getMonth();
            }
            this.switchMonth(this.current.month, this.current.year);

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
                if(self.calendar.getAttribute("data-fox-calendar") == "open" && event.keyCode == 27){
                    self.close();
                    self.element.blur();
                }
                if(self.calendar.getAttribute("data-fox-calendar") == "open" && event.keyCode == 13){
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
                if(!self.calendar.contains(event.target) && !self.element.contains(event.target)){
                    if(event.target != self.calendar && event.target != self.element){
                        self.close();
                    }
                }
            });

            // Store Instance and Return
            this.element.setAttribute("data-fox-calendar", "fox-" + FoxCalendar.count);
            FoxCalendar.instances["fox-" + FoxCalendar.count] = this;
            return this;
        },

        /*
         |  HANDLE :: SWITCH VIEW
         |  @since  0.1.0
         */
        switchView:     function(view){
            if(!this.options.dateFormat){
                return false;
            }

            // Render View
            this.view = view;
            if(view == "month"){
                this.calendar.children[1].innerHTML = this.renderMonth();
                this.calendar.querySelector(".calendar-label").innerText = this.current.year;
            } else {
                this.calendar.children[1].innerHTML = this.renderDay();
                this.calendar.querySelector(".calendar-label").innerText = FoxCalendar.strings.months[this.current.month] + " " + this.current.year;

                // Disable on Range
                var range = this.options.dateRange,
                    year  = this.current.year,
                    month = this.current.month;
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

                        var regex = new RegExp("(|\s+)disable(\s+|)"),
                            time = !!self.options.timeFormat;
                        if(regex.test(this.className)){
                            return false;
                        }

                        if(self.view == "month"){
                            self.switchMonth(parseInt(this.getAttribute("data-fox-month")), self.current.year);
                            self.switchView("day");
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
         */
        renderDay:          function(){
            var start = FoxCalendar.strings.shorts.indexOf(this.options.weekStart),
                week  = FoxCalendar.strings.shorts.slice(start, FoxCalendar.strings.shorts.length);
                week  = week.concat(FoxCalendar.strings.shorts.slice(0, start));

            return '' +
                '<table class="calendar-day">' +
                '    <thead>' +
                '        <tr>' +
                '            <th data-fox-day="' + FoxCalendar.strings.shorts.indexOf(week[0]) + '">' + week[0] + '</th>' +
                '            <th data-fox-day="' + FoxCalendar.strings.shorts.indexOf(week[1]) + '">' + week[1] + '</th>' +
                '            <th data-fox-day="' + FoxCalendar.strings.shorts.indexOf(week[2]) + '">' + week[2] + '</th>' +
                '            <th data-fox-day="' + FoxCalendar.strings.shorts.indexOf(week[3]) + '">' + week[3] + '</th>' +
                '            <th data-fox-day="' + FoxCalendar.strings.shorts.indexOf(week[4]) + '">' + week[4] + '</th>' +
                '            <th data-fox-day="' + FoxCalendar.strings.shorts.indexOf(week[5]) + '">' + week[5] + '</th>' +
                '            <th data-fox-day="' + FoxCalendar.strings.shorts.indexOf(week[6]) + '">' + week[6] + '</th>' +
                '        </tr>' +
                '    </thead>' +
                '    <tbody>' +
                this.createCalendar(this.current.month, this.current.year).render() +
                '   </tbody>' +
                '</table>';
        },

        /*
         |  RENDER :: MONTH VIEW
         |  @since  0.1.0
         */
        renderMonth:    function(){
            var strings = FoxCalendar.strings.months;

            return '' +
                '<table class="calendar-month">' +
                '    <thead>' +
                '        <tr>' +
                '           <th colspan="4">' + FoxCalendar.strings.header[0] + '</th>' +
                '        </tr>' +
                '    </thead>' +
                '    <tbody>' +
                '       <tr>' +
                '           <td class="calendar-month" data-fox-month="0">' + strings[0] + '</td>' +
                '           <td class="calendar-month" data-fox-month="1">' + strings[1] + '</td>' +
                '           <td class="calendar-month" data-fox-month="2">' + strings[2] + '</td>' +
                '       </tr>' +
                '       <tr>' +
                '           <td class="calendar-month" data-fox-month="3">' + strings[3] + '</td>' +
                '           <td class="calendar-month" data-fox-month="4">' + strings[4] + '</td>' +
                '           <td class="calendar-month" data-fox-month="5">' + strings[5] + '</td>' +
                '       </tr>' +
                '       <tr>' +
                '           <td class="calendar-month" data-fox-month="6">' + strings[6] + '</td>' +
                '           <td class="calendar-month" data-fox-month="7">' + strings[7] + '</td>' +
                '           <td class="calendar-month" data-fox-month="8">' + strings[8] + '</td>' +
                '       </tr>' +
                '       <tr>' +
                '           <td class="calendar-month" data-fox-month="9">' + strings[9] + '</td>' +
                '           <td class="calendar-month" data-fox-month="10">' + strings[10] + '</td>' +
                '           <td class="calendar-month" data-fox-month="11">' + strings[11] + '</td>' +
                '       </tr>' +
                '   </tbody>' +
                '</table>';
        },

        /*
         |  RENDER :: TIME VIEW
         |  @since  0.1.0
         */
        renderTime:     function(){
            return '' +
                '<div class="calendar-field calendar-field-h">' +
                '    <input type="number" value="' + new Date().getHours() + '" min="00" max="23" step="1" />' +
                '    <label>' + FoxCalendar.strings.time[0] + '</label>' +
                '</div>' +
                '<div class="calendar-field calendar-field-m">' +
                '    <input type="number" value="' + new Date().getMinutes() + '" min="00" max="59" step="1" />' +
                '    <label>' + FoxCalendar.strings.time[1] + '</label>' +
                '</div>' +
                '<div class="calendar-field calendar-field-s">' +
                '    <input type="number" value="' + new Date().getSeconds() + '" min="00" max="59" step="1" />' +
                '    <label>' + FoxCalendar.strings.time[2] + '</label>' +
                '</div>';
        },

        /*
         |  ACTION :: OPEN CALENDAR
         |  @since  0.1.0
         |  @update 0.1.1
         */
        open:               function(){
            if(this.calendar.getAttribute("data-fox-calendar") != "close"){
                return this;
            }

            this.calendar.style.opacity = 0;
            this.calendar.style.display = "block";
            this.calendar.setAttribute("data-fox-calendar", "idle");
            this.animate = setInterval(function(self){
                self.calendar.style.opacity = parseFloat(self.calendar.style.opacity) + 0.1;
                if(parseFloat(self.calendar.style.opacity) >= 1){
                    self.calendar.style.opacity = 1;
                    self.calendar.style.display = "block";
                    self.calendar.setAttribute("data-fox-calendar", "open");
                    clearInterval(self.animate);
                }
            }, 10, this);
            return this;
        },

        /*
         |  ACTION :: CLOSE CALENDAR
         |  @since  0.1.0
         |  @update 0.1.1
         */
        close:              function(){
            if(this.calendar.getAttribute("data-fox-calendar") != "open"){
                return this;
            }

            this.calendar.style.opacity = 1.0;
            this.calendar.style.display = "block";
            this.calendar.setAttribute("data-fox-calendar", "idle");
            this.animate = setInterval(function(self){
                self.calendar.style.opacity = parseFloat(self.calendar.style.opacity) - 0.1;
                if(parseFloat(self.calendar.style.opacity) <= 0){
                    self.calendar.style.opacity = 0;
                    self.calendar.style.display = "none";
                    self.calendar.setAttribute("data-fox-calendar", "close");
                    clearInterval(self.animate);
                }
            }, 10, this);
            return this;
        },

        /*
         |  ACTION :: CLOSE CALENDAR
         |  @since  0.1.0
         |  @update 0.1.1
         */
        toggle:             function(){
            if(this.calendar.getAttribute("data-fox-calendar") == "idle"){
                return;
            }
            if(this.calendar.getAttribute("data-fox-calendar") == "open"){
                return this.close();
            }
            return this.open();
        },

        /*
         |  ACTION :: SWITCH MONTH
         |  @since  0.1.0
         |  @update 0.1.1
         */
        switchMonth:    function(month, year){
            if(month == "prev"){
                this.current.year  = (this.current.month == 0)? this.current.year-1: this.current.year;
                this.current.month = (this.current.month == 0)? 11: this.current.month-1;
            } else if(month == "next"){
                this.current.year  = (this.current.month == 11)? this.current.year+1: this.current.year;
                this.current.month = (this.current.month == 11)? 0: this.current.month+1;
            } else {
                this.current.year  = year;
                this.current.month = month;
            }
            this.switchView("day");
            return this;
        },

        /*
         |  ACTION :: SWITCH YEAR
         |  @since  0.1.0
         |  @update 0.1.1
         */
        switchYear:     function(year){
            if(year == "prev"){
                this.current.year = this.current.year-1;
            } else if(year == "next"){
                this.current.year = this.current.year+1;
            }
            this.switchView("month");
            return this;
        },

        /*
         |  ACTION :: SELECT A DATE
         |  @since  0.1.0
         |  @update 0.1.1
         */
        selectDate:     function(Y, M, D, h, i, s){
            var n = new Date();

            // Format
            var f = [
                (this.options.dateFormat)? this.options.dateFormat: "",
                (this.options.timeFormat)? this.options.timeFormat: "",
            ];
            f = f.join(" ").trim();

            // Value
            this.element.value = this.convertDate(new Date(
                (Y)?Y:n.getFullYear(), (M)?M:n.getMonth(), (D)?D:n.getDate(),
                (h)?h:0, (i)?i:0, (s)?s:0
            ), f);
            return this;
        },
        selectTime:     function(h, i, s){
            return this.selectDate(false, false, false, h, i, s);
        },

        /*
         |  ACTION :: SELECT CALENDAR
         |  @since  0.1.0
         */
        createCalendar: function(month, year){
            var day = 1, haveDays = true,
                startDay = new Date(year, month, day).getDay(),
                daysInMonths = [31, (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
                calendar = [];

            // Calc start Day
            startDay = startDay-FoxCalendar.strings.shorts.indexOf(this.options.weekStart);
            if(startDay < 0){
                startDay = 7 + startDay;
            }

            // Cache
            if(FoxCalendar.cache[this.options.weekStart + "_" + year] && !FoxCalendar.isIE11){
                if(FoxCalendar.cache[this.options.weekStart + "_" + year][month]){
                    return FoxCalendar.cache[this.options.weekStart + "_" + year][month];
                }
            } else {
                FoxCalendar.cache[this.options.weekStart + "_" + year] = {};
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
            this.current = FoxCalendar.cache[this.options.weekStart + "_" + year][month] = {
                month: month, year: year, content: render, render: function(){
                    return this.content.querySelector("tbody").innerHTML;
                }
            };
            return FoxCalendar.cache[this.options.weekStart + "_" + year][month];
        },

        /*
         |  CONVERT DATE
         |  @since  0.1.0
         */
        convertDate:    function(inDate, format){
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
                M: FoxCalendar.strings.months[inDate.getMonth()].slice(0, 3),
                F: FoxCalendar.strings.months[inDate.getMonth()],
                d: String("00" + inDate.getDate()).toString().slice(-2),
                D: FoxCalendar.strings.days[inDate.getDay()],
                l: FoxCalendar.strings.shorts[inDate.getDay()].toLowerCase()
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
    w.FoxCalendar = FoxCalendar;
})(window, document);
