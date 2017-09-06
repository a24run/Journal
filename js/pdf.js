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
		$scope.getData();
		//$scope.deleteValue("sandwich");
		//$scope.getAllValues();
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
				console.log('Error');
			}
	}
	// Displaying Values from IndexedDb with Key 
	$scope.getData=function(){
		var db = IDBOpenDBRequest.result;
		var transaction	=db.transaction(["primaryObject"])
		var objectStore=transaction.objectStore("primaryObject");
		var objectStoreRequest = objectStore.getAll();
		//var objectStoreRequest = objectStore.get(4)
		/*var index=objectStore.index("title")
		index.get("sandwich").onsuccess=function(event){
			console.log(event.target.result);
		}*/
		objectStoreRequest.onsuccess = function(event) {
			if(objectStoreRequest.result){
				$scope.$apply(function(){
					$scope.memorylist=objectStoreRequest.result;
				});
			}
			//console.log(event.target.result)
		}
		objectStoreRequest.onerror=function(event){
			console.log('Error');
		}
		objectStoreRequest.oncomplete=function(){
			console.log("data loaded ")
		}
	}
	// Getting all values with cursor
	$scope.getAllValues=function(){
		var db = IDBOpenDBRequest.result;
		var transaction	=db.transaction(["primaryObject"])
		var objectStore=transaction.objectStore("primaryObject");
		var objectStoreRequest = objectStore.openCursor();
		objectStoreRequest.onsuccess = function(event) {
			var cursor = event.target.result;
			//console.log(objectStoreRequest.result)
			if (cursor) {
				console.log(cursor.key + " is " + cursor.value);
				cursor.continue();
			}
			else {
				console.log("No more entries!");
			}
		}
		objectStoreRequest.onerror=function(event){
			console.log('Error');
		}
		objectStoreRequest.oncomplete=function(){
			console.log("data loaded ")	
		}
	}
	// Deleting value with value in an Index
	$scope.deleteValue=function(key_data_to_be_deleted){
		var db = IDBOpenDBRequest.result;
		var transaction	=db.transaction(["primaryObject"],"readwrite")
		var objectStore=transaction.objectStore("primaryObject");
		objectStore.index("title").openCursor().onsuccess=function(event){
			var cursor = event.target.result;
			if(cursor){
				console.log(cursor.key);
				if(cursor.key==key_data_to_be_deleted)
					cursor.delete();
				cursor.continue();	
			}
			
		}
		//var objectStoreRequest = objectStore.delete();
		console.log("sandwich deleted ");
	}

	$scope.Imagepreview=false;
	$scope.submit=function(){
		$scope.Imagepreview=true;
		console.log("in memory home"+$scope.bannerImage);
		var image = new Image();
		image.src = ('data:image/png;base64,'+($scope.bannerImage).base64).replace(/(\r\n|\n|\r)/gm,"");
		//document.body.appendChild(image);
		//$element.find(".preview").append(image)
		//var imgData = $scope.getBase64Image($scope.bannerImage);
		$scope.memory.base64Image=image.src;
		$scope.addMemory($scope.memory);
		$scope.getData();
	}
	$scope.deleteMemory=function(index){
		$scope.deleteValue($scope.memorylist[index].title);
		$scope.getData();
	}
	$scope.newsubmit=function(){
		$scope.upload($scope.file);
	}

	// adding image to browser 
	$scope.imageviewr=function(source){
		var image = new Image();
		image.src = source;
		//document.body.appendChild(image);
	}
	// generating a preview for pdf 
	$scope.generateNewPdf=function(){
		//html2canvas and jspdf
		// html2canvas($("#previewDownload")[0], {
		// background :'#FFFFFF',
	 //  		onrendered: function(canvas) {
	 //    	document.body.appendChild(canvas);
	 //  		},
	 //  		with:400,
	 //  		height:$($("#previewDownload")[0]).height()+1000
		// }).then(function(canvas){
		// 	var doc = new jsPDF();
		// 	doc.addHTML(canvas,function() {
		//     	doc.save('web.pdf');
		// 	});
		// })

		// only jspdf

		// var doc = new jsPDF();
		// var temp=$("#previewDownload")[0];
		// doc.addHTML(temp,function() {
	 //    	doc.save('web.pdf');
		// });

	// rasterize html canvas
	var height=($($("#previewDownload")[0]).height())*3;
	var canvas = document.getElementById("canvas"),
	context = canvas.getContext('2d'),
    html_container = $("#parentDivPreview")[0],
    html = html_container.innerHTML;
    context.fillStyle = 'rgba(0,0,0,0.5)';
	context.fillRect(0,0,window.innerWidth,window.innerHeight);
    canvas.height=height;
    canvas.width=window.innerWidth;
	rasterizeHTML.drawHTML(html,canvas)
	.then(function (renderResult) {
    	context.drawImage(renderResult.image, 0, 0);
	}
	, function error(e) {
       console.log(e);
    })
    .then(function(){
		var doc = new jsPDF({
		  orientation: 'portrait',
		  format:[canvas.height, canvas.width]
		});
		doc.addHTML(canvas,function() {
		    doc.save('web.pdf');
		});
	});
	// var doc = new jsPDF();
	// 	doc.addHTML(canv,function() {
	//     	doc.save('web.pdf');
	// 	});

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
	html2canvas(document.body, {
		background :'#FFFFFF',
  		onrendered: function(canvas) {
    	//document.body.appendChild(canvas);
  		}
	}).then(function(canvas){
		//generatePdf();
	})
});