$(document).ready(function() {
    $.post( "/admin/api/api.api", {cmd:'getDBMenu'}).done(function( data ) {
         $('#database_menu').html(data);
    });
});
