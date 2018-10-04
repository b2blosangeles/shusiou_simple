$(document).ready(function() {
    /*
    $.ajax({
      url: '/admin/api/api.api',
      dataType: 'json',
      type: 'post',
      data:  {"cmd":"getDBMenu"},
      success: function( data, textStatus, jQxhr ){
            $('#module_menu').html( JSON.stringify(data) );
      },
      error: function( jqXhr, textStatus, errorThrown ){
      }
    }); 
*/
 
    $.post( "/admin/api/api.api", {cmd:'getDBMenuA'}).done(function( data ) {
         $('#module_menu').html( JSON.stringify(data) );
    });
           /*, function( data ) {
      
    });*/
});
