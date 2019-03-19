var pinNumbers=[15,2];

document.addEventListener("deviceready", onDeviceReady, false);
hideAll();
function onDeviceReady() {
    loginScript();
    $(window).keydown(function(event){
      if(event.keyCode == 13) {
        event.preventDefault();
        return false;
      }
    });
    if(typeof ble === 'undefined'){
      alert("BLE not supported on this device");
    }
    lunchApp();
}
function lunchApp(){
 startSerial();
//  startBLE();

  $(".checkBox i").each(function(){
    $(this).on("click",function(){
      if(!parseInt($(this).data("checked"))){$(this).data("checked","1");$(this).removeClass("fas fa-calendar-times");$(this).addClass("fas fa-calendar-check");}
      else{$(this).data("checked","0");$(this).removeClass("fas fa-calendar-check");$(this).addClass("fas fa-calendar-times");}
    });
    $(this).data("checked","0");
    if(parseInt($(this).data("checked"))){$(this).removeClass("fas fa-calendar-times");$(this).addClass("fas fa-calendar-check");}
    else{$(this).removeClass("fas fa-calendar-check");$(this).addClass("fas fa-calendar-times");}
  });


  $("button[name='test']").on("click",function(e){
    data="";
    for(var index=0 ;index <2;index++){
      console.log(index);
      var pin=pinNumbers[index].toString();
      var enable=$(".checkBox i").eq(index).data("checked");
      var runtime=$("input[name='runtime']").eq(index).val();
      var alarmType=$("select[name='relaySelect']").eq(index).val();
      var min=$("input[name='min']").eq(index).val();;
      var max=$("input[name='max']").eq(index).val();;
      if(runtime==="")runtime="0";
      localStorage.setItem((index).toString(),(pin+","+enable+","+runtime+","+alarmType+","+min+","+max));
      data+=(pin+","+enable+","+runtime+","+alarmType+","+min+","+max);
      if(index<1)data+=",";
    }
    //writeBLE(data);
    writeSerial(data);
  });

  $("button[name='setZero']").on("click",function(e){
    writeSerial("l");
    if(calibrationTimeout !== undefined)clearTimeout(calibrationTimeout);
    var calibrationTimeout=setTimeout(function(){
      alert("Put on the real weight and set that value in the input field");
      $("button[name='calibrate']").one("click",function(){
        writeSerial((parseFloat($("input[name='actualWeight']").val())*parseFloat(localStorage.getItem("weight_unit_transforme")).toFixed(4)*1000));
      });
    },2000);
  });
  $("#setSpeed").on("click",function(){
    writeSerial("m,"+$("#motorSpeed").val());
  })
}
