/*!!
 * Power Panel DB <https://github.com/carlos-sweb/pp-db>
 * @author Carlos Illesca
 * @version 1.0.0 (2020/04/09 21:21 PM)
 * Released under the MIT License
 */
(function(global , factory ){

  	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :

  	typeof define === 'function' && define.amd ? define('ppDB', factory) :

	(global = global || self, (function () {

    var exports = global.ppDB = factory();

	}()
	
));

})( this,(function() {
	return function(){		
		// Normalización
		// En la siguiente línea, puede incluir prefijos de implementación que quiera probar.
		window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
		// No use "var indexedDB = ..." Si no está en una función.
		// Por otra parte, puedes necesitar referencias a algun objeto window.IDB*:
		window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
		window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
		// (Mozilla nunca ha prefijado estos objetos, por lo tanto no necesitamos window.mozIDB*)
		if(!window.indexedDB) {
			window.alert("Su navegador no soporta una versión estable de indexedDB. Tal y como las características no serán validas");
		}

		this.db = null;

		this.DB = window.indexedDB;

		
		this.getDatabases = function(){

		}		

		/*OPEN DATABASE*/
		this.open = function( dbname , version , stores ,events){

			events = events == undefined || events == null ? {}: events;			

			this.db = null;
			var request = this.DB.open(dbname,version);
			// ------------------------------------------------------------------			
			request.onerror = function(event){
				if( events.hasOwnProperty("error") ){
					events["error"](event);
				}				
			}
			// ------------------------------------------------------------------
			request.onsuccess = function(event){				
				//--------------------------------
				if( this.db == null  ){this.db =  event.target.result;}
				// Emit database initialize
				// -------------------------------
				if( events.hasOwnProperty("success") ){
					events["success"]( this.db );
				}
			}
			// ------------------------------------------------------------------
			request.onupgradeneeded = function(event){	

				var __db = event.target.result;

				if( stores != null && stores != undefined){
					var keys = Object.keys(stores);
					keys.forEach(function(index){						
						__db.createObjectStore(index,stores[index]);
					});
				}

				if( events.hasOwnProperty("upgradeneeded") ){
					events["upgradeneeded"](__db);
				}
				
			}
			// ------------------------------------------------------------------
		}
		/*OPEN database*/
		// ---
		//------------------------------
		//DELETE
		this.delete = function( dbname , success){
			var deleteRequest = this.DB.deleteDatabase(dbname);

			deleteRequest.onerror = function(){
				console.log("Error deleting database.");
			}

			deleteRequest.onsuccess = function(event){
				if( typeof success == 'function' ){
					success(event);
				}
			}

		}
		//---------------------------------
	}
}));
