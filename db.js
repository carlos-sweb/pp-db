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

		/*OPEN DATABASE*/
		this.open = function( dbname , version , events){

			var request = this.DB.open(dbname,version);
			// ------------------------------------------------------------------
			if( events.hasOwnProperty("error") ){
				request.onerror = function(event){
					events["error"](event);
				}
			}
			// ------------------------------------------------------------------
			request.onsuccess = function(event){
				this.db = request.result;
				// Emit database initialize
				if( events.hasOwnProperty("success") ){
					events["success"](event);
				}
			}
			// ------------------------------------------------------------------
			request.onupgradeneeded = function(event){
				if( events.hasOwnProperty("upgradeneeded") ){
					events["upgradeneeded"](event);
				}
			}
			// ------------------------------------------------------------------
		}
		/*OPEN database*/
		// ---
	}
}));
