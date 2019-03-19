
var dataArray=[[],[]];
var serverUrl="https://3d61682e.ngrok.io/BleApp/ble.php";
var  service_uuid="75cf7374-a137-47e7-95e5-e675189c8a3e";
var  characteristic_uuid="0d563a58-196a-48ce-ace2-dfec78acc814";
var dataReader=null;
var connectedDevice=null;
function scanForDevice() {
  alert("gonna scan");
  ble.scan([], 30, function(device) {
    $(".BLE_search").append('<div class="BLE_device"><p>'+
      device.name+'</p><button class="connect_button" type="button" name="'+device.id+ '">Connect <i class="fas fa-ellipsis-v"></i> <i class="fab fa-bluetooth-b"></i></button></div>');
      alert(device.name);
      if(device.name=="MyESP32"){
        ble.autoConnect(device.id,function(BleDevice){
          connectedDevice=BleDevice;
          collectDataWhenConnected(BleDevice);
        },function(){alert("couldn't connect");});
      }
      if(typeof $(".BLE_device")==='undefined'){
        alert("nothing found");
      }else {
        $(".BLE_device button").on('click',function(event){
              ble.autoConnect(this.name, function(BleDevice){
                console.log("connected")
                collectDataWhenConnected(BleDevice);
              },function(){alert("couldn't connect");});
              });

          }
        });
}
function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}
function isIn(array1,variable1){
  for(i in array1){
    if(array1[i].name===variable1){
      return true;
    }
  }
  return false;
}

function collectDataWhenConnected(BleDevice){
  console.log(BleDevice);
  console.log(bytesToString(BleDevice.advertising));
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
function stringToBytes(string) {
   var array = new Uint8Array(string.length);
   for (var i = 0, l = string.length; i < l; i++) {
       array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}
function readBLEsuccess(dataRead){
  showData(bytesToString(dataRead));
}

function readBLEfail(BleDevice){
  console.log("reconnectin ... ");

  ble.isConnected(BleDevice.id,function(){console.log("connected");
},function(){console.log("not connected");clearInterval(dataReader);});
}



function showData(data){

    var temperature = data.substring(data.indexOf("Temperature: ")+"Temperature: ".length,data.indexOf("C"));
    var weight = data.substring(data.indexOf("Weight: ")+"Weight: ".length,data.indexOf("Kg"));
    $("#temperature").html(temperature+'<i class="fas fa-thermometer-half"></i>');
    $("#weight").html(weight+'<i class="fas fa-weight-hanging"></i>');
//   dataArray=recordData(data,dataArray);
  // saveData(dataArray);
}
function saveData(data){
  text = localStorage.getItem("Data");//get the item
  if (text!=null) {//if it's not empty then we push new element
    obj = JSON.parse(text);
    }
    myJSON = JSON.stringify(obj);

  localStorage.setItem("Data", myJSON);
  dataArray=[[],[]];
}

function recordData(data,placeToStoreData){
  placeToStoreData[0].push(parseInt(data));
  placeToStoreData[1].push(new Date().toISOString());
  return placeToStoreData;
}
