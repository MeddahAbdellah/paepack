
$(".fa-bars").on("click",function(){
  hideAll();
  $(".menuWrapper").show();
});
$("#settingsRoute").on("click",function(){
  hideAll();
  if(localStorage.getItem("role")=="technician")$(".settingsWrapper").show();
});
$("#relayRoute").on("click",function(){
  hideAll();
  if(localStorage.getItem("role")=="technician")$(".relayPanelWrapper").show();
  else{alert("need a technician Password");$("#disconnect").click();}
});

$("#sensorsRoute").on("click",function(){
  hideAll();
  if(localStorage.getItem("role")=="technician")$(".sensorsPanelWrapper").show();
  else{alert("need a technician Password");$("#disconnect").click();}
});
$("#motorRoute").on("click",function(){
  hideAll();
  if(localStorage.getItem("role")=="technician")$(".motorPanelWrapper").show();
  else{alert("need a technician Password");$("#disconnect").click();}
});

$("#weightRoute").on("click",function(){
  hideAll();
  if(localStorage.getItem("role")=="technician")$(".weightPanelWrapper").show();
  else{alert("need a technician Password");$("#disconnect").click();}
});
$("#dashboard").on("click",function(){
  hideAll();
  $(".productPanelWrapper").show();
});
$("#disconnect").on("click",function(){
  hideAll();
  var equipement_id=localStorage.getItem("equipement_id");
  localStorage.clear();
  localStorage.setItem("equipement_id",equipement_id);
  if(localStorage.getItem("sample_number")===null)localStorage.setItem("sample_number","0");
  if(localStorage.getItem("weight_unit_transforme")===null)localStorage.setItem("weight_unit_transforme","1");
  if(localStorage.getItem("temperature_unit_transforme")===null)localStorage.setItem("temperature_unit_transforme","0");
  $("input").val("");
  $(".loginWrapper").show();
});

function hideAll(){
  $(".equipementloginWrapper").hide();
  $(".loginWrapper").hide();
  $(".productSelectionWrapper").hide();
  $(".menuWrapper").hide();
  $(".relayPanelWrapper").hide();
  $(".motorPanelWrapper").hide();
  $(".weightPanelWrapper").hide();
  $(".sensorsPanelWrapper").hide();
  $(".settingsWrapper").hide();
  $(".productPanelWrapper").hide();
}
