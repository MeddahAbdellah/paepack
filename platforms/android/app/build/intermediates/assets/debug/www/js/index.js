var pinNumbers=[4,2];
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  alert("deviceReady");
    $(window).keydown(function(event){
      if(event.keyCode == 13) {
        event.preventDefault();
        return false;
      }
    });
    if(typeof ble === 'undefined'){
      alert("BLE not supported on this device");
    }
    //scanForDevice();
    $(".checkBox i").each(function(){
      $(this).on("click",function(){
        if(!parseInt($(this).data("checked"))){$(this).data("checked","1");$(this).removeClass("fas fa-calendar-times");$(this).addClass("fas fa-calendar-check");}
        else{$(this).data("checked","0");$(this).removeClass("fas fa-calendar-check");$(this).addClass("fas fa-calendar-times");}
      });
      $(this).data("checked","0");
      if(parseInt($(this).data("checked"))){$(this).removeClass("fas fa-calendar-times");$(this).addClass("fas fa-calendar-check");}
      else{$(this).removeClass("fas fa-calendar-check");$(this).addClass("fas fa-calendar-times");}
    });
    $("button[name='update']").on("click",function(e){
      var index=$("button[name='update']").index(this);
      var pin=pinNumbers[index].toString();
      var enable=$(".checkBox i").eq(index).data("checked");
      var runtime=$("input[name='runtime']").eq(index).val();
      if(runtime==="")runtime="0";
      localStorage.setItem((index).toString(),(pin+","+enable+","+runtime));
      data=localStorage.getItem((index).toString());
    //  writeBLE(data);
    })

}
