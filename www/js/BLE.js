var serverUrl=" https://www.bfp.com/bfp_clients";
var service_uuid="75cf7374-a137-47e7-95e5-e675189c8a3e";
var characteristic_uuid="0d563a58-196a-48ce-ace2-dfec78acc814";
//localStorage.setItem("equipement_id","9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08");
var dataReader=null;
var connectedDevice=null;
var serialRead = '';
var pulse=0;
var pulsetemp=0;
var lastRead = new Date();
var audit_count=0;// make an audit_id
if(localStorage.getItem("sample_number")===null)localStorage.setItem("sample_number","0");
if(localStorage.getItem("weight_unit_transforme")===null)localStorage.setItem("weight_unit_transforme","1");
if(localStorage.getItem("temperature_unit_transforme")===null)localStorage.setItem("temperature_unit_transforme","0");
/* BLE communication */
function startBLE() {
  ble.scan([], 30, function(device) {
      alert(device.name);
      if(device.name=="PAEPACK"){
        ble.autoConnect(device.id,function(BleDevice){
          connectedDevice=BleDevice;
          collectDataWhenConnected(BleDevice);
        },function(){alert("couldn't connect to PAEPACK BLE device");});
      }
        });
}

function collectDataWhenConnected(BleDevice){
  console.log(BleDevice);
  console.log(bytesToString(BleDevice.advertising));
  //ble.startNotification(connectedDevice.id, service_uuid,characteristic_uuid,function(dataRead){readBLEsuccess(dataRead)},readBLEfail(connectedDevice));
       dataReader = setInterval(readBLE,2000);

}
function readBLE(){
console.log(connectedDevice.id);
ble.read(connectedDevice.id, service_uuid,characteristic_uuid,function(dataRead){readBLEsuccess(dataRead)},readBLEfail(connectedDevice));

}
function writeBLE(data){

  ble.write(connectedDevice.id, service_uuid, characteristic_uuid, stringToBytes(data), function(){
    console.log("sent : "+data);
  }, function(){writeBLE();});
}

function readBLEsuccess(dataRead){
  if(localStorage.getItem("po")!==null)showData(bytesToString(dataRead));
}

function readBLEfail(BleDevice){
  console.log("reconnectin ... ");
  ble.isConnected(BleDevice.id,function(){console.log("connected");
},function(){console.log("not connected");clearInterval(dataReader);});
}

/* END BLE communication */
/* Serial Communciation*/
function startSerial(){
  serial.requestPermission(
  function(successMessage) {
    serial.open(
        {baudRate: 115200},
          function(successMessage) {
            serial.registerReadCallback(
            function success(data){
              var view = new Uint8Array(data);
              serialToString(view);
            },
            function error(){
              new Error("Failed to register read callback");
            });
        },
        errorCallback
    );
  },
  errorCallback
  );
}

var errorCallback = function(message) {
alert('Error: Could not connect to device ' + message +"Reconnecting");
serial.open(
    {baudRate: 115200},
      function(successMessage) {
        serial.registerReadCallback(
        function success(data){
          var view = new Uint8Array(data);
          serialToString(view);
        },
        function error(){
          new Error("Failed to register read callback");
        });
        lunchApp();
    },
    errorCallback
);
};
function writeSerial(data){
  serial.write(data, function(){}, function(){alert("couldn't send");});
}
/* END Serial Communication*/
function showData(data){
    var temperature = parseFloat(data.substring(data.indexOf("Temperature: ")+"Temperature: ".length,data.indexOf("C")));
    var weight = parseFloat(data.substring(data.indexOf("Weight: ")+"Weight: ".length,data.indexOf("Kg")));
    weight=parseFloat(weight/1000).toFixed(4);
    weight=parseFloat(weight)*parseFloat(localStorage.getItem("weight_unit_transforme"));
    weight=weight.toFixed(4);
    temperature=parseFloat(temperature)+parseFloat(localStorage.getItem("temperature_unit_transforme"));
    if(weight<0)weight="0";
    $("#dashTemperature").html(temperature);
    $("#dashWeight").html(weight);
    $("#temperature").html(temperature+'<i class="fas fa-thermometer-half"></i>');
    $("#weight").html(weight+'<i class="fas fa-weight-hanging"></i>');
    pulseDetection(weight,temperature,data);

}

function pulseDetection(x,temp,data){
if(x>pulse){
pulse=x;
pulsetemp=temp;
}
if((pulse-x)>1){
  addSampleToTable(pulse,pulsetemp,data);
  pulse=0;
  }
}
function addSampleToTable(pulse,temp,data){
  var sample=parseInt(localStorage.getItem("sample_number"))+1;
  localStorage.setItem("sample_number",sample);
  var currentDate=new Date().toISOString();
  var case_weight=localStorage.getItem("case_weight");
  var state="Passed";
  if(parseFloat(pulse) > parseFloat(localStorage.getItem("usl")) || parseFloat(pulse) < parseFloat(localStorage.getItem("lsl")))state="Failed";
  var row="<tr><th>"+sample+"</th><th>"+currentDate+"</th><th>"+case_weight+"</th><th>"+pulse+"</th><th>"+temp+"</th><th>"+state+"</th></tr>"
  $("table").append(row);
  if(localStorage.getItem("equipement_id")!==null){
  saveData(temp,pulse,state);
  sendData();
  }
}

function saveData(temp,weight,state){
  var newDataObj={equipement_id:localStorage.getItem("equipement_id"),
                  temperature:temp,
                  weight:weight,
                  time:new Date().toISOString(),
                  product:localStorage.getItem("product_name"),
                  lsl:localStorage.getItem("lsl"),
                  usl:localStorage.getItem("usl"),
                  case_weight:localStorage.getItem("case_weight"),
                  mode:localStorage.getItem("weight_unit_transforme"),
                  code_date:localStorage.getItem("code_date"),
                  po_number:localStorage.getItem("po"),
                  operator:localStorage.getItem("operator"),
                  upc:localStorage.getItem("UPC"),
                  status:state,
                  audit_id:localStorage.getItem("audit_id")};
  if(localStorage.getItem("audit_id")!==null ){
    if(parseInt(localStorage.getItem("audit_size"))>0){
      audit_count=parseInt(localStorage.getItem("audit_size"));
      audit_count--;
      localStorage.setItem("audit_size",audit_count);
    }else{
      localStorage.removeItem("audit_id");
      $("#operating_mode").html("MODE <span>PASSIVE</span>");
    }
  }
  var obj=[];
  text = localStorage.getItem("Data");//get the item
  if (text!==null) {//if it's not empty then we push new element
    obj = JSON.parse(text);
  }
  obj.push(newDataObj);
  myJSON = JSON.stringify(obj);
  localStorage.setItem("Data", myJSON);
}
function sendData(){
  var dataPacket=localStorage.getItem("Data");
  if(dataPacket!==null){
  $.ajax({
      type:"POST",
      url:serverUrl+"/addData.php",
      data:{data:dataPacket},
      success:function(response){
        localStorage.removeItem("Data");
      },
      error:function(error){
        alert(error);
      }
  });
  }
}
/* Drivers */
function stringToBytes(string) {
   var array = new Uint8Array(string.length);
   for (var i = 0, l = string.length; i < l; i++) {
       array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}
function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}
function serialToString(view){

                               if(view.length >= 1) {
                                   for(var i=0; i < view.length; i++) {
                                       // if we received a \n, the message is complete, display it
                                       if(view[i] === 13) {
                                           // check if the read rate correspond to the arduino serial print rate
                                          var now = new Date();
                                          showData(serialRead);
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

/* END Drivers */
/*AUDIT*/
function auditLunched(){

}
/*END AUDIT*/
function isIn(array1,variable1){
  for(i in array1){
    if(array1[i].name===variable1){
      return true;
    }
  }
  return false;
}
