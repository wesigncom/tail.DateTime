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
        months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
        days:   ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
        shorts: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
        time:   ["Jam", "Menit", "Detik"],
        header: ["Plih Bulan", "Pilih Tahun", "Pilih Dekade", "Pilih Waktu"]
    });
    return datetime;
}));
