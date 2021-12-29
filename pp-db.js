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
       var exports = global.ppDB = factory( );
	  }()
));
})( this,(function() {

  // In the following line, you should include the prefixes of implementations you want to test.
  window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  // DON'T use "var indexedDB = ..." if you're not in a function.
  // Moreover, you may need references to some window.IDB* objects:
  window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
  window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
  // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)
    // -------------------------------------------------------------------------
    /**
     *@databases
     *@description -
     *@type - Function
     * */
    var databases = function( done ){
        this.DB.databases().then(function( databases ){
            done(databases);
        }.bind(this));
    }
    // -------------------------------------------------------------------------
    var add = function( table , data , done){
          var db = 	this.request.result;
          var transaction = db.transaction(table, "readwrite");
          var objectStore = transaction.objectStore(table);
          data.forEach((item) => {
              var objectStoreRequest = objectStore.add(item);
              objectStoreRequest.onsuccess = function(){
                  done(this , item )
              }.bind(this)
          });
    }
    // -------------------------------------------------------------------------
    var getAll = function( table , done ){
        var db = this.request.result;
        var transaction = db.transaction(table, "readwrite");
        var objectStore = transaction.objectStore(table);

        var request = objectStore.getAll()
        // -----------------------------------------------------
        request.onsuccess = function( event ){
              done( request.result)
        }
    }


    var error = function( Error ){
          console.log(Error);
    }


    var onupgradeneeded = function( event ){

      var db = event.target.result;
      options.tables.forEach(( table )=>{

          var objectStore = db.createObjectStore( table.table, { keyPath: "id", autoIncrement:true });

          console.log(objectStore);

          /*
          table.fields.forEach(( field )=>{
              objectStore.createIndex(field.name,field.name,{unique:false});
          });
          */

          objectStore.transaction.oncomplete = function(event) {

              var tableObjectStore = db.transaction(table.table, "readwrite").objectStore(table.table);
              table.data.forEach((data)=>{
                  tableObjectStore.add(data)
              });
          }
      });
    }


          // -------------------------------------------------------------------
          var ppDB = function( options){
                // -------------------------------------------------------------
                this.DB = window.indexedDB
                // -------------------------------------------------------------
                ppIs.isObject(options,function(opt){

                  this.request   = window.indexedDB.open(
                    opt.name ,
                    opt.version
                  );

                  this.request.onsuccess = function(event){
                     ppIs.isFunction( opt.success ) ? opt.success(event) : void(0);
                  }.bind(this)
                  // -----------------------------------------------------------
                  this.request.onerror = error;
                  // -----------------------------------------------------------
                  //this.request.onupgradeneeded = onupgradeneeded.bind(this);
                  // -----------------------------------------------------------
                }.bind(this))
                // -------------------------------------------------------------
                this.databases = databases.bind(this);
                // -------------------------------------------------------------
                this.add       = add.bind(this);
                // -------------------------------------------------------------
                this.getAll    = getAll.bind(this)
                // -------------------------------------------------------------
            }
            // -----------------------------------------------------------------
            return ppDB;
            // -----------------------------------------------------------------
}));
