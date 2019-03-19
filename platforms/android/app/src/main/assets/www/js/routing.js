

$(".fa-bars").on("click",function(){
  hideAll();
  $(".menuWrapper").show();
});
$(".fa-bars").click();
$("#relayRoute").on("click",function(){
  hideAll();
  $(".relayPanelWrapper").show();
});

$("#sensorsRoute").on("click",function(){
  hideAll();
  $(".sensorsPanelWrapper").show();
});
$("#motorRoute").on("click",function(){
  hideAll();
  $(".motorPanelWrapper").show();
});

$("#weightRoute").on("click",function(){
  hideAll();
  $(".weightPanelWrapper").show();
});

function hideAll(){
  $(".menuWrapper").hide();
  $(".relayPanelWrapper").hide();
  $(".motorPanelWrapper").hide();
  $(".weightPanelWrapper").hide();
  $(".sensorsPanelWrapper").hide();
}
