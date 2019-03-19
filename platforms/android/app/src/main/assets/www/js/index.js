var pinNumbers=[4,2];
var serialRead = '';
var lastRead = new Date();
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
    var errorCallback = function(message) {
    alert('Error: Could not connect to device ' + message);
    };
    lunchApp();
  /*  serial.requestPermission(
    function(successMessage) {
    	serial.open(
        	{baudRate: 115200},
            function(successMessage) {
              lunchApp();
        	},
        	errorCallback
    	);
    },
    errorCallback
    );
*/

}
function lunchApp(){
  scanForDevice();


/*  serial.registerReadCallback(
	function success(data){
		var view = new Uint8Array(data);
		serialToString(view);
  //  alert("data : "+readData);
	},
	function error(){
		new Error("Failed to register read callback");
	});*/


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
    writeBLE(data);
});
}

function serialToString(view){

                               if(view.length >= 1) {
                                   for(var i=0; i < view.length; i++) {
                                       // if we received a \n, the message is complete, display it
                                       if(view[i] === 13) {
                                           // check if the read rate correspond to the arduino serial print rate
                                          var now = new Date();
                                          alert(serialRead);
                                          lastRead = now;
                                          serialRead= '';
                                       }
                                       // if not, concatenate with the begening of the message
                                       else {
                                           var temp_str = String.fromCharCode(view[i]);
                                           serialRead+= temp_str;
                                       }
                                   }
                               }
}
