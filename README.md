tail.DateTime
=============
[![plainJS](https://s.pytes.net/3fd80118)](https://s.pytes.net/e0b6ce86)
[![npm](https://s.pytes.net/4afcd19c)](https://s.pytes.net/64a7f3a3)
[![npm](https://s.pytes.net/2f3f75c4)](https://s.pytes.net/64a7f3a3)
[![Software License](https://s.pytes.net/8257ac72)](LICENSE.md)
[![Author](https://s.pytes.net/5542d1fa)](https://www.github.com/pytesNET)

The **tail.DateTime** package provides an extensive and configurable Date/Time Calendar Picker for
your website, written in vanilla JavaScript and without any dependencies! It was originally a fork
of MrGuiseppes [Pure JS Calendar](https://github.com/MrGuiseppe/pureJSCalendar), but version 0.4.0
broke away from the last original lines and the script is now completely independent!

[Wanna see **tail.DateTime** in action?](https://github.pytes.net/tail.DateTime)

[Wanna translate **tail.DateTime** in your language?](https://github.com/pytesNET/tail.DateTime/wiki/Help-Translating)

Features
--------
-   A beautiful Date/Time Picker (in 2 Designs + 6 Color Schemes)
-   Definable ranges of selectable dates (Blacklist / Whitelist)
-   Colorable Tooltips with an cute animation
-   Different Views to navigate quickly: Days, Months, Years & Decades
-   Completely Translatable and already available in 9 languages
-   Extendable and Bindable through different Events
-   Compatible with AMD, tested with requireJS
-   Many Settings to adapt and configure the design and behavior
-   Compatible with all modern browsers **(including IE 9+)**
-   No Dependencies, just embed and use
-   Free/To/Use - MIT Licensed

Install & Embed
---------------
The master branch will always contain the latest Release, which you can download directly here
as [.tar](https://github.com/pytesNET/tail.DateTime/tarball/master) or as [.zip](https://github.com/pytesNET/tail.DateTime/zipball/master)
archive, or just visit the [Releases](https://github.com/pytesNET/tail.DateTime/releases) Page
on GitHub directly. You can also be cool and using NPM (or YARN):

```markup
npm install tail.datetime --save
```

```markup
yarn add tail.datetime --save
```

```markup
bower install tail.datetime --save
```

### Using a CDN
You can also use the awesome CDN services from jsDelivr or UNPKG.

```markup
https://cdn.jsdelivr.net/npm/tail.datetime@latest/
```

```markup
https://unpkg.com/tail.datetime/
```

Thanks To
---------
-   [MrGuiseppe](https://github.com/MrGuiseppe) for the Inspiration
-   [Octicons](https://octicons.github.com/) for the cute Icons
-   [jsCompress](https://jscompress.com/) for the Compressor
-   [prismJS](https://prismjs.com) for the Syntax highlighting library
-   [MenuSpy](https://github.com/lcdsantos/menuspy) for the Menu Navigation

### Translations
-   [Mohammed Alsiddeeq Ahmed](https://github.com/mosid) / [Arabic Translation](https://github.com/pytesNET/tail.DateTime/issues/1)
-   [Júnior Garcia](https://github.com/juniorgarcia) / [Brazilian Portuguese Translation](https://github.com/pytesNET/tail.DateTime/issues/13)
-   [mickeybyte](https://github.com/mickeybyte) / [Dutch Translation](https://github.com/pytesNET/tail.DateTime/issues/15)
-   [noxludio](https://github.com/noxludio) / [Finnish Translation](https://github.com/pytesNET/tail.DateTime/pull/17)
-   [FlashPanther](https://github.com/FlashPanther) / [French Translation](https://github.com/pytesNET/tail.DateTime/pull/19)
-   [Fabio Di Stasio](https://github.com/Fabio286) / [Italian Translation](https://github.com/pytesNET/tail.DateTime/issues/10)

Documentation
-------------
The Documentation has been moved to [GitHubs Wiki Pages](https://github.com/pytesNET/tail.DateTime/wiki),
but I will keep a table of contents list here and some basic instructions.

-   [Install & Embed](https://www.github.com/pytesNET/tail.DateTime/wiki/instructions)
-   [Default Usage](https://www.github.com/pytesNET/tail.DateTime/wiki/default-usage)
-   [Public Options](https://www.github.com/pytesNET/tail.DateTime/wiki/public-options)
-   [Public Methods](https://www.github.com/pytesNET/tail.DateTime/wiki/public-methods)
-   [Events & Callbacks](https://www.github.com/pytesNET/tail.DateTime/wiki/events-callbacks)
-   [Internal Variables & Methods](https://www.github.com/pytesNET/tail.DateTime/wiki/internal)

### Basic Instructions
You can pass up to 2 arguments to the **tail.DateTime** constructor, the first parameter is required
and need to be an `Element`, a `NodeList`, a `HTMLCollection`, an Array with `Element` objects or
just a single selector as `string`, which calls the `querySelectorAll()` method on its own. The
second parameter is optional and, if set, MUST be an object with your *tail.DateTime* options.

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />

        <link type="text/css" rel="stylesheet" href="css/tail.datetime-default.css" />
        <!-- Additional Stylesheets -->
    </head>
    <body>
        <script type="text/javascript" src="js/tail.datetime.min.js"></script>
        <!-- <script type="text/javascript" src="langs/tail.datetime-{lang}.js"></script> -->

        <input type="text" class="tail-datetime-field" />

        <script type="text/javascript">
            document.addEventListener("DOMContentLoaded", function(){
                tail.DateTime(".tail-datetime-field", { /* Your Options */ });
            });
        </script>
    </body>
</html>
```

### Default Settings
Please check out [GitHubs Wiki Pages](https://github.com/pytesNET/tail.DateTime/wiki) to read more
about each single option!

```javascript
tail.DateTime(".tail-datetime-field", {
    animate: true,
    classNames: false,
    closeButton: true,              // New in 0.4.5
    dateFormat: "YYYY-mm-dd",
    dateStart: false,
    dateRanges: [],
    dateBlacklist: true,
    dateEnd: false,
    locale: "en",
    position: "bottom",
    rtl: "auto",
    startOpen: false,
    stayOpen: false,
    timeFormat: "HH:ii:ss",
    timeHours: null,                // New Syntax in 0.4.5
    timeMinutes: null,              // New Syntax in 0.4.5
    timeSeconds: 0,                 // New Syntax in 0.4.5
    timeIncrement: true,            // New in 0.4.5
    timeStepHours: 1,               // New in 0.4.3
    timeStepMinutes: 5,             // New in 0.4.3
    timeStepSeconds: 5,             // New in 0.4.3
    today: true,
    tooltips: [],
    viewDefault: "days",
    viewDecades: true,
    viewYears: true,
    viewMonths: true,
    viewDays: true,
    weekStart: 0
});
```

Copyright & License
-------------------
Published under the MIT-License; Copyright &copy; 2018 - 2019 SamBrishes, pytesNET
