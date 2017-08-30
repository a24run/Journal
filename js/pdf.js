var app=angular.module("PdfApplication",['ngRoute','ngFileUpload']);

// Routes 
// app.config(function($routeProvider) {
//     $routeProvider
//     .when("/", {
//         templateUrl : "home.html"
//     })
//     .when("/pdf", {
//         templateUrl : "HtmlPDF.html"
//     })
// });

// To Show and Hide Pages (As there is o server)

app.controller('main',function($scope,Upload){
	// pre declarations 
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
	if (!window.indexedDB) {
	   window.alert("Your browser doesn't support a stable version of IndexedDB.")
	}
	$scope.getBase64Image=function(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

	$scope.submit=function(){
		console.log("in memory home");
		var imgData = $scope.getBase64Image($scope.bannerImage);
		console.log(imgData);
		console.log($scope.memory)
	}
	$scope.newsubmit=function(){
		$scope.upload($scope.file);
	}

	// adding image to browser 
	$scope.imageviewr=function(source){
		var image = new Image();
		image.src = source;
		document.body.appendChild(image);
	}
	// upload on file select 
    $scope.upload = function (file) {
    	var toB64Canvas = $scope.getBase64Image(file)
        console.log("base 64 "+toB64Canvas);
        $scope.imageviewr(toB64Canvas);
    };

    // conver the image to base 64 
	    $scope.getBase64Image=function(img) {
	    var canvas = document.createElement("canvas");
	    var image= new Image(200,200);
	    image.src=img.name;
	    canvas.width = 400;
	    canvas.height = 400;
	    var ctx = canvas.getContext("2d");
	    ctx.drawImage(image, 0, 0);
	    var dataURL = canvas.toDataURL("image/png");
	    return dataURL;
	    //return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
	}
});



// Generating and downloading PDf 
app.controller('pdf', function($scope){
	var doc = new jsPDF();
	var generatePdf=function(){
			doc.addHTML(document.body,function() {
	    	doc.save('web.pdf');
		});
	}
	//generatePdf();
	//generatePdf();
	html2canvas(document.body, {
		background :'#FFFFFF',
  		onrendered: function(canvas) {
    	//document.body.appendChild(canvas);
  		}
	}).then(function(canvas){
		//generatePdf();
	})
});