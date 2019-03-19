function loginScript(){
  getProducts();
  hideAll();
  if(localStorage.getItem("equipement_id")===null){
    $(".equipementloginWrapper").show();
  }
  else if(localStorage.getItem("id")===null){
    $(".loginWrapper").show();
    $("#LSL").html(localStorage.getItem("lsl"));
    $("#USL").html(localStorage.getItem("usl"));
    $("#po").html("PO# : "+localStorage.getItem("po"));
    $("#upc").html("UPC : "+localStorage.getItem("UPC"));
    $("#product_name").html(localStorage.getItem("product_name"));
    $("#code_date").html("Code Date : "+localStorage.getItem("code_date"));
  }
  else{
    if(localStorage.getItem("logo")!==null)$(".header img").attr("src",localStorage.getItem("logo"));

    $(".fa-bars").click();
  }
  $("button[name='userbutton']").on("click",function(){
    var number=$(".password input").val()+$(this).html();
    $(".password input").val(number);
  });

  $("button[name='login']").on("click",function(){
    $.ajax({
            type:"POST",
            url:serverUrl+"/userLogin.php",
            data:{password:$("input[name='password']").val() ,equipement_id:localStorage.getItem("equipement_id")},
            success:function(response){
              response=JSON.parse(response);
              localStorage.setItem("id",response.id);
              localStorage.setItem("user_id",response.user_id);
              localStorage.setItem("role",response.role);
              localStorage.setItem("operator",response.name);
              $("#operator").html("Operator : "+response.name);
              console.log(response.id);
              console.log(response.role);
              getProducts();
              hideAll();
              $(".productSelectionWrapper").show();
            },
            error:function(error){
              alert("Wrong Username Or Password");
            }
    });
  });

  $("button[name='equipementlogin']").on("click",function(){
    $.ajax({
            type:"POST",
            url:serverUrl+"/equipementLogin.php",
            data:{code:$("input[name='equipementlogin']").val()},
            success:function(response){
              response=JSON.parse(response);
              localStorage.setItem("equipement_id",response.equipement_id);
              hideAll();
              $(".loginWrapper").show();
            },
            error:function(error){
              alert("Wrong Username Or Password");
            }
    });
  });


$("button[name='selectProduct']").on("click",function(){
  $.ajax({
          type:"POST",
          url:serverUrl+"/selectProduct.php",
          data:{product_name:$("select[name='products']").val()},
          success:function(response){
            response=JSON.parse(response);
            console.log(response);
            localStorage.setItem("product_name",$("select[name='products']").val())
            localStorage.setItem("lsl",response.LSL);
            localStorage.setItem("usl",response.USL);
            $("#LSL").html(response.LSL);
            $("#USL").html(response.USL)
            localStorage.setItem("case_weight",response.case_weight);
            if(response.mode=="lbs")localStorage.setItem("weight_unit_transforme",2.20462);
            if(response.mode=="kg")localStorage.setItem("weight_unit_transforme",1);
            localStorage.setItem("po",$("input[name='po']").val());
            localStorage.setItem("UPC",response.upc)
            $("#po").html("PO# : "+$("input[name='po']").val());
            $("#upc").html("UPC : "+response.upc);
            localStorage.setItem("code_date",$("input[name='code_date']").val());
            $("#product_name").html($("select[name='products']").val());
            $("#code_date").html("Code Date : "+$("input[name='code_date']").val());
            hideAll();
            $(".productPanelWrapper").show();
          },
          error:function(error){
            alert("Not connected");
          }
  });
});
}
function getProducts(){
  $.ajax({
          type:"POST",
          url:serverUrl+"/products.php",
          data:{user_id:localStorage.getItem("user_id")},
          success:function(response){
            $("select[name='products']").html("");
            response=JSON.parse(response);
            console.log(response);
            for(var i in response){
              $("select[name='products']").append('<option value="'+response[i].product_name+'">'+response[i].product_name+'</option>');
            }
          },
          error:function(error){
            alert("Not Conncted");
          }
  });
}

/*
$("button[name='subscribe']").on("click",function(){
  hideAll();
  $('input').removeClass('greyPlaceHolder');
  $('input').addClass('whitePlaceHolder');
  $(".subscribeWrapper").show();
});
$("button[name='register']").on("click",function(){
  if($(".subscribe input[name='password']").val().length<8){
    alert("Password must contain more than 8 charachters");
  }
  else if(!validateEmail($(".subscribe input[name='email']").val())){
    alert("Email is not valid");
  }
  else if($(".subscribe input[name='user_name']").val().length<8){
    alert("Username must contain more than 8 charachters");
  }else{
    var blobImage = $("input[name='logo']").prop('files')[0];
    new ImageCompressor(blobImage, {
    quality: .6,
    maxHeight:30,
    maxWidth:80,
    success(result) {

      var reader = new FileReader();
   reader.readAsDataURL(result);
   reader.onloadend = function() {
         var image=this.result;

         $.ajax({
                 type:"POST",
                 url:serverUrl+"/addUser.php",
                 data:{logo:image,username:$(".subscribe input[name='user_name']").val(),company:$(".subscribe input[name='company_name']").val(),
                       password:$(".subscribe input[name='password']").val(),email:$(".subscribe input[name='email']").val()},
                 success:function(response){
                   localStorage.setItem("id",response);
                   localStorage.setItem("logo",image);
                   $(".header img").attr("src",image);
                   $(".header img").attr("class","landscape");
                   $(".fa-bars").click();
                 },
                 error:function(error){
                   alert("Couldn't connect to server");
                 }
               });
   }
    },
    error(e) {
      console.log(e.message);
    },
    });

  }
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
*/
