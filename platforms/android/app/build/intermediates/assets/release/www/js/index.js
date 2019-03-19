
var dataArray=[[],[]];
var serverUrl="https://8b62596d.ngrok.io/BleApp/ble.php";
var serverFileGenerator="https://8b62596d.ngrok.io/BleApp/ble_download.php"
var fileUrl="https://8b62596d.ngrok.io/BleApp/results.json";
document.addEventListener("deviceready", onDeviceReady, false);
localStorage.removeItem("Data");
function onDeviceReady() {
$(".homePage form input").val(localStorage.getItem("user"));
  $(window).keydown(function(event){
  if(event.keyCode == 13) {
    event.preventDefault();
    return false;
  }
});

  $("button[name='download']").on('click', function () {
    var fileTransfer = new FileTransfer();
    var uri = encodeURI(fileUrl);

    fileTransfer.download(
        uri,
        cordova.file.externalApplicationStorageDirectory+'bleAppData.json',
        function(entry) {
            console.log("download complete: " + entry.toURL());
            cordova.plugins.notification.local.schedule({
              title: 'JSON file downloaded , use JSON Viewer',
              text: entry.toURL(),
              foreground: true
  });
        },
        function(error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("download error code" + error.code);
        },
        false,
        {
            headers: {
                "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
            }
        }
    );
        $.ajax({
            url: serverFileGenerator,
            method: 'GET',
            success: function (data) {
                console.log(typeof data);

            },
            failure: function(){
              console.log("failed");
            }
        });

  });

    $(".homePage button").on('click',function(e){
    $(".homePage").css('left','-100vw');
    addNewUser();

    localStorage.setItem("Data", myJSON);
    if(typeof ble === 'undefined'){
      alert("BLE not supported on this device");
    }
    ble.scan([], 30, function(device) {
      $(".BLE_search").append('<div class="BLE_device"><p>'+
        device.name+'</p><button class="connect_button" type="button" name="'+device.id+ '">Connect <i class="fas fa-ellipsis-v"></i> <i class="fab fa-bluetooth-b"></i></button></div>');
        if(typeof $(".BLE_device")==='undefined'){
          console.log("nothing found");
        }else {

          $(".BLE_device button").on('click',function(event){
                console.log(this.name);
                ble.autoConnect(this.name, function(BleDevice){

                  collectDataWhenConnected(BleDevice);
                },function(){console.log("couldn't connect");});
                });

            }});
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
function addNewUser(){
  sessionStorage.setItem("user", $(".homePage form input").val());
  localStorage.setItem("user",$(".homePage form input").val());
  text = localStorage.getItem("Data");//get the item
  if (text!=null) {//if it's not empty then we push new element
  obj = JSON.parse(text);
  if(!isIn(obj["users"],sessionStorage.getItem("user")))
  {
    obj["users"].push({"name":sessionStorage.getItem("user"),"HVR":[],"timestamp":[]});
  }
  myJSON = JSON.stringify(obj);
  }else {// else if it's empty we create new users table
    myJSON=JSON.stringify({"users":[{"name":sessionStorage.getItem("user"),"HVR":[],"timestamp":[]}]});
  }

}
function collectDataWhenConnected(BleDevice){
  console.log(BleDevice);
  console.log(bytesToString(BleDevice.advertising));
  $(".BLE_search").css('left','-100vw');
  $(".BLE_services").html('<div class="BLE_search_header"><h1>SERVICES</h1></div>');
  for(i in BleDevice.services){
    $(".BLE_services").append('<div class="BLE_service"><p>'+
      BleDevice.services[i]+'</p><button class="connect_button" type="button" name="'+i+ '">get data <i class="fas fa-ellipsis-v"></i> <i class="fab fa-bluetooth-b"></i></button></div>');
    }
    $(".BLE_service button").on('click',function(event){
      var service_uuid;
      var characteristic_uuid;
      var indicator=parseInt(this.name);
      for(j in BleDevice.characteristics){
        if(BleDevice.characteristics[j].service===BleDevice.services[indicator]){
          service_uuid=BleDevice.characteristics[j].service;
          characteristic_uuid=BleDevice.characteristics[j].characteristic;
          console.log(service_uuid);
          console.log(characteristic_uuid);
        }else {
          console.log(BleDevice.characteristics[j].service);
          console.log(BleDevice.services[indicator]);
        }
      }
      if(typeof service_uuid!=="undefined" && typeof characteristic_uuid!=="undefined"){

      var dataReader = window.setInterval(function(){ble.read(BleDevice.id, service_uuid,
                                                          characteristic_uuid,
                                                          function(dataRead){
                                                              showData(bytesToString(dataRead));
                                                              $("button[name='send']").off().on('click',function(){
                                                                $.ajax({
                                                                          type:'POST',
                                                                          url: serverUrl,
                                                                          data:{data: localStorage.getItem("Data")},
                                                                          success:function(data) {
                                                                            console.log('success');
                                                                            text = localStorage.getItem("Data");
                                                                            if (text!=null) {//if it's not empty then we push new element
                                                                              obj = JSON.parse(text);
                                                                              for(i in obj["users"]){
                                                                                  obj["users"][i].HVR=[];
                                                                                  obj["users"][i].timestamp=[];
                                                                              }
                                                                              myJSON = JSON.stringify(obj);
                                                                              localStorage.setItem("Data", myJSON);
                                                                              dataArray=[[],[]];
                                                                          }
                                                                          }

                                                                        })
                                                              });
                                                          },function(){
                                                              console.log("reconnectin ... ");
                                                              $(".BLE_services").css('left','0vw');
                                                              $(".BLE_service button").unbind( "click" );
                                                              clearInterval(dataReader);
                                                              ble.isConnected(BleDevice.id,function(){console.log("connected");},
                                                              function(){
                                                                console.log("not connected");
                                                              });

                                                            });
                                                  },1000);//dataReader end
                                                  }
    });


}//collectDataWhenConnected end


function showData(data){
  $(".BLE_services").css('left','-100vw');
  $(".data_display h2:first").text(data);
  $(".data_show i").animate({fontSize: '50px'},500);
  $(".data_show i").animate({fontSize: '70px'},500);
   dataArray=recordData(data,dataArray);
   saveData(dataArray);


}
function saveData(data){
  text = localStorage.getItem("Data");//get the item
  console.log(data[0]);
  console.log(data[1]);
  if (text!=null) {//if it's not empty then we push new element
    obj = JSON.parse(text);
    for(i in obj["users"]){
      if(obj["users"][i].name===sessionStorage.getItem("user")){
        obj["users"][i].HVR=Array.from(obj["users"][i].HVR).concat(data[0]);
        obj["users"][i].timestamp=Array.from(obj["users"][i].timestamp).concat(data[1]);
        console.log(Array.from(obj["users"][i].HVR).concat(data[0]));
        console.log(Array.from(obj["users"][i].timestamp).concat(data[1]));
      }
    }
    myJSON = JSON.stringify(obj);
  }else {// else if it's empty we create new users table
    myJSON=JSON.stringify({"users":[]});
  }
  localStorage.setItem("Data", myJSON);
}

function recordData(data,placeToStoreData){
  placeToStoreData[0].push(parseInt(data));
  placeToStoreData[1].push(new Date().toISOString());
  return placeToStoreData;
}
function shrinkHeart(){
  $(".data_show i").animate({fontSize: '50px'},500,function(){growHeart();});
}
function growHeart(){
  $(".data_show i").animate({fontSize: '70px'},500,function(){shrinkHeart();});
}
function stopHeart(){
  $(".data_show i").stop();
}
