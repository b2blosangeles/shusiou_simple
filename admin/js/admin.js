function control(cmd, db_id) {
  $('#main_admin_control').find('input[name=appCmd]').val(cmd);
  $('#main_admin_control').find('input[name=dbid]').val(db_id);
  $('#main_admin_control').submit();
}
$(document).ready(function() {
    if ($('#database_module')[0]) {
        loadDBModule();
    }
});

function loadDBModule() {
    $.post( "/admin/api/api.api", {cmd:'getDBModule'}).done(function( data ) {
        console.log(data);
         $('#database_module').html(data);
    }); 
}
