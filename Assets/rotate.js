$(document).ready(function($) {
(function($){
      var Rotate   = function(element, options){
      var view360  = $(element);
      var obj      = this;
      var defaults = {
          imageDir:'images/product-1',
          imageExt:'jpg', //could be png, jpg, bmp
          imageCount:0,
          itemsCount:2,
          zoomPower:2,
          zoomRadius:100, 
          autoRotate:false, // could be set to true.
          autoRotateInterval:100, // Auto Rotate Speed
          fadeInInterval:100,
          canvasWidth:0,
          canvasHeight:0,
          canvasID:''       
      };

      var canvas;
      var loaded = false;
      var context;
      var iMouseX, iMouseY = 1;
      var bMouseDown = false;
      var tx;
      var img_Array = new Array();
      var ga = 0.0;
      var fadeTimerId = 0;
      var auto_rotate_count = 0;
      var autoRotateTimeId = 0;
      var modulus = 0;
      var zoomOn = 0;
      var autorotate_button;
      options = $.extend(defaults, options);

      var clear = function(){
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      }

var load_images = function(){

    for(var i=1; i <= options.imageCount; i++){
        img_Array[i] = new Image();
        img_Array[i].src = options.imageDir + "/" + i+"."+ options.imageExt;
        clear();
        img_Array[i].onload = function(){
        context.font = 'italic 40pt Calibri';
        context.fillText('loading:'+(i-1)+"/"+ options.imageCount, 150, 100);
     }
    }
}

var fadeIn = function(){
          clear();
          context.globalAlpha = ga;
          image = new Image();
          image.onload = function(){
              context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);
          };
          image.src=options.imageDir + "/" + "1."+options.imageExt;
          ga = ga + 0.1;
          if (ga > 1.0){
              clearInterval(fadeTimerId);
          }
}

var init_= function(){
    // Error Handling
    if(options.canvasWidth == 0){
      alert("Provide a CANVAS WIDTH")
    }
    if(options.canvasHeight == 0){
      alert("Provide a CANVAS Height")
    }
    if(options.imageCount <= 0){
      alert("provide IMAGE COUNT ")
    }
    if(options.canvasID == ""){
      alert("provide CANVAS ID ");
    }
    if(options.zoomPower <= 0){
      alert("Zoom Power have a value of greater than 0");
    }
    if(options.zoomRadius < 50){
      alert("Provide a Zoom Radius of at least 50 or more ");
    }
    if(options.imageExt == ""){
      alert("Provide Image extension. Ex: png,jpg");
    }
    if(options.imageDir == ""){
      alert("Provide Image Direcotry");
    }


    view360.append("<canvas class='"+options.canvasID+"' width='" +
                  options.canvasWidth +"' height='"+options.canvasHeight+
                  "'></canvas>").css({cursor:'e-resize'
                 });

view360.css({width:options.canvasWidth + "px",height:options.canvasHeight + "px",position:'relative'});

view360.find('.autorotate').css({position:'absolute', right:"1%",display:'block',padding:'5px'});


canvas  = document.getElementsByClassName(options.canvasID);

// getting all the canvases 
for(i = 0; i < canvas.length; i+=1){
  context = canvas[i].getContext('2d');

  tx      = canvas[i].width / options.imageCount;
}

clear();
load_images();

fadeTimerId = setInterval(function(){
  fadeIn();
}, options.fadeInInterval);

if(options.autoRotate == true && typeof img_Array[options.imageCount] != 'undefined') {
  start_auto_rotate();
  view360.find(".autorotate").text("Stop Auto Rotate");
}

view360.find("canvas").mousemove(function(e){
var ProductNumber = parseInt($(this).parent().attr('class')[2]); // gettingclassName 
var canvasOffset = $(canvas[0]).offset();
    console.log(canvasOffset)
    iMouseX = Math.floor(e.pageX - canvasOffset.left);
    iMouseY = Math.floor(e.pageY - canvasOffset.top);

    modulus = Math.ceil(iMouseX / tx);

    if(modulus<=0) { 
        modulus = 1;
    }else if(modulus > options.imageCount){
        modulus = options.imageCount;
    };

    if(options.autoRotate == false && bMouseDown == false){
        rotate360(modulus);
    }

    if(bMouseDown == true){
      zoom(img_Array[zoomOn]);
    }
});

// Range Change Detector: 
// Start Mobile Touch Handler:

var view = document.querySelectorAll('.slider');
view.forEach(function(prod){
    prod.addEventListener('input', function(){
        var canvasOffset = $(canvas[0]).offset();
              var iMouseX = $(this).val();
              var whichProduct = $(prod).parent().find('canvas').attr('class');
              modulus = Math.ceil(iMouseX);
              console.warn()

              if(modulus<=0) { 
                  modulus = 1;
              }else if(modulus > options.imageCount){
                  modulus = options.imageCount;
              };

              if(options.autoRotate == false && bMouseDown == false){
                  if(context.canvas.className == whichProduct ){
                     rotate360(modulus)
                  }
              }

              if(bMouseDown == true){
                zoom(img_Array[zoomOn]);
              }


    } ,false)
})


// End Mobile Touch Handler.

view360.find("."+options.canvasID).mousedown(function(e){
      bMouseDown = true;
     if(options.autoRotate == true){
        stop_auto_rotate();
      }

     var canvasOffset = $(canvas[0]).offset();
     iMouseX = Math.floor(e.pageX - canvasOffset.left);
     iMouseY = Math.floor(e.pageY - canvasOffset.top);
     zoomOn  = Math.ceil(iMouseX / tx); //find image number that is to be zoomed on
         
    if(zoomOn<=0) {
       zoomOn=1
    }else if(zoomOn >options.imageCount){
       zoomOn=options.imageCount
    }
});

  view360.find("."+options.canvasID).mouseup(function(e) {
      bMouseDown = false;
      zoomOn=0;
      $(this).css({cursor:'e-resize'});
  });

  view360.find(".autorotate").click(function(e){
        e.preventDefault();
        if(options.autoRotate==false){
            start_auto_rotate();
            $(this).text("Stop Auto Rotate");
        }
        else{
            stop_auto_rotate();
            $(this).text("Auto Rotate");
        }
  });
}

var rotate360 = function(img_no){
  console.log(context)
  clear();
  context.drawImage(img_Array[img_no], 0, 0, context.canvas.width,context.canvas.height);
}

var start_auto_rotate= function(){
  options.autoRotate = true;
  autoRotateTimeId = setInterval(function(){auto_rotate360();},options.autoRotateInterval);
}

function stop_auto_rotate(){
  options.autoRotate = false;
  clearInterval(autoRotateTimeId);
}

function auto_rotate360(){
    if(modulus >0 && modulus<=options.imageCount && auto_rotate_count<=0){auto_rotate_count=modulus;} 
    auto_rotate_count++;
    if(auto_rotate_count>options.imageCount){
    auto_rotate_count=1;
    }
  rotate360(auto_rotate_count);
}

var zoom = function(image){
    clear();
    if (bMouseDown) {
        context.drawImage(image, 0 - iMouseX * (options.zoomPower - 1), 0 - iMouseY * (options.zoomPower - 1), context.canvas.width * options.zoomPower, context.canvas.height * options.zoomPower);
        context.globalCompositeOperation = 'destination-atop';
        context.beginPath();
        context.arc(iMouseX, iMouseY, options.zoomRadius, 0, Math.PI*2, true);
        context.closePath();
        context.fill();
    }
       context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);
}
  
 init_();
};


$.fn.rotate = function(options){
       return this.each(function(){
           var element = $(this);
           if (element.data('rotate')) return;
           var rotate = new Rotate(this, options);
           element.data('rotate', rotate);
       });
   };

//  Script Initialization
  $(".p-1").rotate({
    imageDir:'images/product-1',
    imageCount:36, // How Many Images
    imageExt:'jpg', // Image Extention
    canvasID:'Product',
    canvasWidth:530,
    canvasHeight:420,
    autoRotate:false // Auto Rotate is set to false.
    });

    $(".p-2").rotate({
    imageDir:'images/product-2',
    imageCount:36, // How Many Images
    imageExt:'jpg', // Image Extention
    canvasID:'Product-2',
    canvasWidth:530,
    canvasHeight:420,
    autoRotate:false // Auto Rotate is set to false.
    });

    $(".p-3").rotate({
    imageDir:'images/product-3',
    imageCount:72, // How Many Images
    imageExt:'jpg', // Image Extention
    canvasID:'Product-3',
    canvasWidth:530,
    canvasHeight:420,
    autoRotate:false // Auto Rotate is set to false.
    });

    $(".p-4").rotate({
    imageDir:'images/product-1',
    imageCount:36, // How Many Images
    imageExt:'jpg', // Image Extention
    canvasID:'Product-4',
    canvasWidth:530,
    canvasHeight:420,
    autoRotate:false // Auto Rotate is set to false.
    });
})(jQuery);

    var Body = $('body');
    Body.addClass('preloader-site');
});

$(window).load(function() {
  $(".loader").delay(2000).fadeOut("slow");
  $("#overlayer").delay(2000).fadeOut("slow");
})
