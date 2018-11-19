/*
 |  tail.DateTime - A pure, vanilla JavaScript DateTime Picker
 |  @file       ./langs/tail.datetime-ar.js
 |  @author     SamBrishes <sam@pytes.net>
 |  @version    0.4.1 - Beta
 |
 |  @fork       MrGuiseppe <https://github.com/MrGuiseppe/pureJSCalendar>
 |              This script started as fork and is now completely independent!
 |
 |  @website    https://github.com/pytesNET/tail.DateTime
 |  @license    X11 / MIT License
 |  @copyright  Copyright © 2018 - SamBrishes, pytesNET <pytes@gmx.net>
 */
;(function(factory){
   if(typeof(define) == "function" && define.amd){
       define(function(){
           return function(datetime){ factory(datetime); };
       });
   } else {
       if(typeof(window.tail) != "undefined" && window.tail.DateTime){
           factory(window.tail.DateTime);
       }
   }
}(function(datetime){
    months: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
    days:   ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
    shorts: ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"],
    time:   ["ساعة", "دقيقة", "ثانية"],
    header: ["إختر الشهر", "إخنر السنة", "إختر العقد", "إختر الوقت"]
    return datetime;
}));
