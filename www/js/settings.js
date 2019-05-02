$('select[name="measurments"]').on("change",function(){
  if(this.value=="metric")localStorage.setItem("weight_unit_transforme","1");
  if(this.value=="sae")localStorage.setItem("weight_unit_transforme","2.20462");
});
