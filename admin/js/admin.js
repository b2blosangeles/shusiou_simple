function control(cmd, db_id) {
  $('#main_admin_control').find('input[name=appCmd]').val(cmd);
  $('#main_admin_control').find('input[name=dbid]').val(db_id);
  $('#main_admin_control').submit();
}
$(document).ready(function() {
    $.post( "/admin/api/api.api", {cmd:'getDBMenu'}).done(function( data ) {
         $('#database_menu').html(data);
    });
});

function dbEdit() {
  $('#database_edit').html('niu ' + new Date());
}
