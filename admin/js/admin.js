$(document).ready(function() {
    $.ajax({
      url: '/admin/api/api.api',
      dataType: 'json',
      type: 'post',
      data:  {"cmd":"getDBMenu"},
      success: function( data, textStatus, jQxhr ){
        alert(1);
      },
      error: function( jqXhr, textStatus, errorThrown ){
          alert(2);
      }
    }); 
  /*
    $.post( "/admin/api/api.api", {cmd:'getDBMenu'}).done(function( data ) {
    alert( "Data Loaded: " + data );
  });*/
           /*, function( data ) {
       $('#module_menu').html( JSON.stringify(data) );
    });*/
});
