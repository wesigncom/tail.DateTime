Fox Calendar
============
> Version: 0.1.1 (Alpha)<br />
> License: X11 / MIT<br />
> Author: SamBrishes, MrGuiseppe

**The FoxCalendar script is a fork of the [Pure JS Calendar](https://github.com/MrGuiseppe/pureJSCalendar), written by [MrGuiseppe](https://github.com/MrGuiseppe).** It is specially designed for the new, yet published, backend theme for the FoxCMS. The Fox Calendar script offers the following changes compared to the Pure JS Calendar:

-   A Time Picker (Hours, Minutes, Seconds)
-   A Month-Based browse view
-   A slightly different date/time output format
-   A slightly different HTML class/id layout
-   A different JS structure / implementation / constructur (Prototyping)
-   Key Listener for 'Escape' (Close) and 'Enter' (Use Today / First Day of the month)
-   Auto-Close on click outside of the calendar popup / input element
-   Instance Caching + Calendar Caching with the first day in the week
-   Default value depending on the input field
-   "Translatable" Strings through the global variable

[Simple Demonstration](https://sambrishes.github.io/FoxCalendar/)

Work in Progress
----------------
The script is still **Work in Progress** and hasn't been tested much!

Thanks to [MrGuiseppe](https://github.com/MrGuiseppe)!

Options
-------
```
    FoxCalendar(document.getElementById("my-input-field"), {
        position:       "bottom",
        dateFormat:     "YYYY-mm-dd",
        timeFormat:     "HH:ii:ss",
        dateRange:      [],
        weekStart:      "SUN"
    });
```

### position
The position of the Fox Calendar, use "top", "left", "right" or "bottom".

### dateFormat
The date format, use false to disable the date picker.

### timeFormat
The time format, use false to disable the time picker.

### dateRange
The range of valid, selectable dates. Allows an array with up to 2 Date objects, the first marks the beginning of the date range, the last one the ending of it.

### weekStart
The short code of the first day in the week, depending on the translation/string global variable: "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT".

Date/Time Format
----------------
<table>
    <tr>
        <th>Code</th>
        <th>Description</th>
    </tr>
    <tr>
        <th>H</th>
        <td>24-hour format of an hour, use `HH` for leading zeros!</td>
    </tr>
    <tr>
        <th>G</th>
        <td>12-hour format of an hour, use `GG` for leading zeros!</td>
    </tr>
    <tr>
        <th>A</th>
        <td>Uppercase Ante meridiem and Post meridiem (AM or PM).</td>
    </tr>
    <tr>
        <th>a</th>
        <td>Lowercase Ante meridiem and Post meridiem (am or om).</td>
    </tr>
    <tr>
        <th>i</th>
        <td>Minutes, use `ii` for leading zeros.</td>
    </tr>
    <tr>
        <th>s</th>
        <td>Seconds, use `ss` for leading zeros.</td>
    </tr>
    <tr>
        <th>Y</th>
        <td>A (4-digit) numeric representation of a year, used as `YY` or `YYYY`.</td>
    </tr>
    <tr>
        <th>y</th>
        <td>A (2-digit) numeric representation of a year, used as `yy`.</td>
    </tr>
    <tr>
        <th>m</th>
        <td>Numeric representation of a month, use `mm` for leading zeros.</td>
    </tr>
    <tr>
        <th>M</th>
        <td>A short textual representation of a month, three letters.</td>
    </tr>
    <tr>
        <th>F</th>
        <td>A full textual representation of a month, such as March.</td>
    </tr>
    <tr>
        <th>d</th>
        <td>Day of the month, use `dd` for leading zeros.</td>
    </tr>
    <tr>
        <th>D</th>
        <td>A textual representation of a day, three letters.</td>
    </tr>
    <tr>
        <th>l</th>
        <td>(Lower `L`) A full textual representation of the day of the week.</td>
    </tr>
</table>

Methods
-------
```
    var calendar = FoxCalendar(document.getElementById("my-input-field"));
    calendar.<method>();
```

### open()
This method opens the calendar popup, if it isn't already open!

### close()
This method closes the calendar popup, if it is still open!

### toggle()
This method toggles the open/close option of the calendar popup.

### switchMonth(monthNum, year)
This method changes the shown month (monthNum starts with 0). You can also use "prev" or "next" to just browse forward and back.

### switchYear(year)
This method changes the year within the month view. You can also use "prev" or "next" to just browse forward and back.

### selectDate(Y, M, D, H, i, s)
Select a date with year, month, day, hours, minutes and seconds.

### selectTime(H, i, s)
Select a time (alias for `selectDate`) with hours, minutes and seconds.