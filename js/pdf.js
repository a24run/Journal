var app=angular.module("PdfApplication",['ngRoute','ngFileUpload','naif.base64']);

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

app.controller('main',function($scope,Upload,$element){
	// pre declarations 
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
	if (!window.indexedDB) {
	   window.alert("Your browser doesn't support a stable version of IndexedDB.")
	}
	// data base creation and usage 
	var db;
	// Let us open our database
	var DBOpenRequest = window.indexedDB.open("Journal", 1);

	// these event handlers act on the database being opened.
	DBOpenRequest.onerror = function(event) {
		/*note.innerHTML += '<li>Error loading database.</li>';*/
		console.log("error in the db transaction")
	};

	DBOpenRequest.onsuccess = function(event) {
		/*note.innerHTML += '<li>Database initialised.</li>';*/
		console.log("Success in db transaction")

		// store the result of opening the database in the db
		// variable. This is used a lot below
		db = DBOpenRequest.result;

		// Run the displayData() function to populate the task
		// listwith all the to-do list data already in the IDB
		/*displayData();*/
	};


	$scope.Imagepreview=false;
	$scope.submit=function(){
		$scope.Imagepreview=true;
		console.log("in memory home"+$scope.bannerImage);
		var image = new Image();
		image.src = 'data:image/png;base64,'+($scope.bannerImage).base64;
		//document.body.appendChild(image);
		$element.find(".preview").append(image)
		//var imgData = $scope.getBase64Image($scope.bannerImage);
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