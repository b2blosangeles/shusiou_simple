$(document).ready(function() {
    $.post( "/admin/api/api.api", {cmd:'getDBMenu'}).done(function( data ) {
         $('#module_menu').html(data);
    });
});
