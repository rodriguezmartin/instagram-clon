angular.module('instagram.services')
.service('MediaService', [
  function() {

    var vars = {};

    this.setCameraDiv = function(div){
      vars.cameraDiv = div;
    };
    vars.canvas = document.createElement("canvas");
    vars.canvas.id = "previewCanvas";
    vars.canvas.width = window.screen.width;
    vars.canvas.height = window.screen.width;
    vars.ctx = vars.canvas.getContext("2d");


    var tools = {};

    tools.resize = function(base64Image){
      return new Promise(function(resolve,reject){
        var HERMITE = new Hermite_class();
        var image = new Image();
        image.id = 'resample';
        image.style.display = 'none';
        vars.cameraDiv.appendChild(image);
        image.onload = function(){
          var height = image.height * 1080 / image.width;
          resolve(HERMITE.resize_image('resample', 1080, height));
        };
        image.src = base64Image;
      });
    };

    tools.toBase64 = function(file){
      return new Promise(function(resolve,reject){
        if(typeof file === 'String'){
          var image = new Image();
          image.onload = function(){
            vars.ctx.drawImage(image, 0, 0);
            var base64PictureData = vars.canvas.toDataURL('image/jpeg');
            vars.canvas.clearRect(0, 0, vars.canvas.width, vars.canvas.height)
            resolve(base64PictureData);
          };
          image.src = file;
        }
        else{
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function () {
            resolve(reader.result);
          };
          reader.onerror = function (error) {
            reject(error);
          };
        }
      });
    };


    this.camera = {};

    this.camera.show = function(){
      if(ionic.Platform.isAndroid())
        CameraPreview.startCamera({
          height: window.screen.width,
          camera: CameraPreview.CAMERA_DIRECTION.BACK,
          tapPhoto: false,
          tapFocus: true
        });
    };

    this.camera.hide = function(){
      if(ionic.Platform.isAndroid())
        CameraPreview.stopCamera();
    };

    this.camera.switch = function(){
      if(ionic.Platform.isAndroid())
        CameraPreview.switchCamera();
    };

    this.camera.takePicture = function(){
      return new Promise(function(resolve,reject){
        if(ionic.Platform.isAndroid()){
          CameraPreview.takePicture({
            width:1080, 
            height:1080, 
            quality: 85
          },function(base64PictureData){
            resolve('data:image/jpeg;base64,'+ base64PictureData);
          });
        }
        else{
          grabFromGallery().then(function(base64Image){
            resolve(base64Image);
          });
        }
      });
    };

    this.grabFromGallery = function(){
      return new Promise(function(resolve,reject){
        if(ionic.Platform.isAndroid()){
          Camera.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
          navigator.camera.getPicture(function(imageURI){
            tools.toBase64(imageURI).then(function(base64){
              tools.resize(base64).then(function(resized){
                resolve(resized);
              });
            });
          },function(err){
            console.log(err);
          },{
            destinationType: 0
          });
        }
        else{
          var input = document.createElement('input');
          input.type = 'file';
          input.style.display = 'none';
          vars.cameraDiv.appendChild(input);
          input.click();
          input.addEventListener('change',function(){
            tools.toBase64(input.files[0]).then(function(base64){
              vars.cameraDiv.removeChild(input);
              tools.resize(base64).then(function(resized){
                resolve(resized);
              });
            });
          });
        }
      });
    };
    var grabFromGallery = this.grabFromGallery;


    this.previewResult = {};
    
    this.previewResult.show = function(base64Image){
      vars.cameraDiv.appendChild(vars.canvas);
      var image = new Image();
      image.onload = function(){
        fitInCanvas(vars.canvas, vars.ctx, image);
      };
      image.src = base64Image;
    };

    this.previewResult.hide = function(){
      vars.ctx.clearRect(0, 0, vars.canvas.width, vars.canvas.height);
      if(document.getElementById('previewCanvas'))
        vars.cameraDiv.removeChild(vars.canvas);
    };

  }
]);