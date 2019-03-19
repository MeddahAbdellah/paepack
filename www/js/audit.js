startListening();
function startListening(){
  var socket = io("https://32e40b83.ngrok.io");
  socket.emit('room', {room_name : 'equipement'});
  socket.on("startAudit",function(data){

    /*
     * ajax audit_id, if audit_id is set , we send it
     * store date , equipement and get audit id
     * take audit_size to start counting
    */
    if(data.equipement_id===localStorage.getItem("equipement_id"))lunchAudit(data.audit_size);
  });
}
function lunchAudit(audit_size){
  $("#operating_mode").html("MODE <span>AUDIT</span>");
  var now= new Date().toJSON().slice(0, 19).replace('T', ' ');
  $.ajax({
    type:"POST",
    url:serverUrl+"/PAEPACK/createAudit.php",
    data:{user_id:localStorage.getItem("user_id"),
          equipement_id:localStorage.getItem("equipement_id"),
          audit_date:now,
          audit_size:audit_size},
    success:function(results){
      localStorage.setItem("audit_id",results);
      localStorage.setItem("audit_size",audit_size);
    },
    error: function(){
      console.log("Couldn't lunch Audit");
    }
  })
}
