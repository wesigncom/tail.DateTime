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
    datetime.strings.register("tr", {
        months: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
        days:   ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
        shorts: ["PA", "PT", "SA", "ÇA", "PE", "CU", "CT"],
        time:   ["Saat", "Dakika", "Saniye"],
        header: ["Ay Seçin", "Yıl Seçin", "On Yıl Seçin", "Zaman Seçin"]
    });
    return datetime;
}));
