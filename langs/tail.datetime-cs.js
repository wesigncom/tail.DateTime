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
    datetime.strings.register("de", {
        months: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"],
        days:   ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"],
        shorts: ["NE", "PO", "ÚT", "ST", "ČT", "PÁ", "SO"],
        time:   ["Hodiny", "Minuty", "Sekundy"],
        header: ["Vyberte měsíc", "Vyberte rok", "Vyberte desetiletí", "Vyberte čas"]
    });
    return datetime;
}));
