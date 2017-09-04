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

	// db name 
	var dbName="journal";
	var db;
	// data base creation and usage 
	// Let us open our database
	var IDBOpenDBRequest = window.indexedDB.open(dbName, 1);
	// error 
	IDBOpenDBRequest.onerror = function(event) {
		console.log("error in the db transaction"+event)
	};

	// success 
	IDBOpenDBRequest.onsuccess = function(event) {
		console.log("Success in db transaction")
		// store the result of opening the database in the db
		// variable. This is used a lot below
		db = IDBOpenDBRequest.result;
		//example();
	};
	// On upgrade needed 
	IDBOpenDBRequest.onupgradeneeded=function(event){
		console.log("in onupgrade needed")
		var db = event.target.result;
		if(!db.objectStoreNames.contains("primaryObject"))
		{
			console.log("in the not clause to generate the object store ");
			var objectStore=db.createObjectStore('primaryObject',{KeyPath:'id', autoIncrement:true});
			objectStore.createIndex("title", "title", { unique: false });
			objectStore.createIndex("description", "description", { unique: false });
			objectStore.createIndex("base64Image", "base64Image", { unique: false });
			objectStore.createIndex("date", "date", { unique: false });
			var newData=[{"title":"example","description":"description","base64Image":"base64Image","date":"date"}];
			objectStore.transaction.oncomplete = function(event) {
			    // Store values in the newly created objectStore.
			    var primaryObjectStore = db.transaction("primaryObject", "readwrite").objectStore("primaryObject");
			    for (var i in newData) {
			      primaryObjectStore.add(newData[i]);
			    }
			}
		}
		else{
			console.log("in else ");
		}	
	}
	// Adding Values into IndexedDb
	$scope.addMemory=function(memoryTuple){
		var db = IDBOpenDBRequest.result;
		var transaction	=db.transaction(["primaryObject"], "readwrite")
		var objectStore=transaction.objectStore("primaryObject");
			var objectStoreRequest = objectStore.add(memoryTuple);
			objectStoreRequest.onsuccess = function(event) {
				console.log("data added"+memoryTuple)
			}
			objectStoreRequest.onerror=function(event){
				console.log('u fucked up ');
			}
	}
	// Displaying Values from IndexedDb
	

	$scope.Imagepreview=false;
	$scope.submit=function(){
		$scope.Imagepreview=true;
		console.log("in memory home"+$scope.bannerImage);
		var image = new Image();
		image.src = 'data:image/png;base64,'+($scope.bannerImage).base64;
		//document.body.appendChild(image);
		$element.find(".preview").append(image)
		//var imgData = $scope.getBase64Image($scope.bannerImage);
		$scope.memory.base64Image=image.src;
		$scope.addMemory($scope.memory);
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