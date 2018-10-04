function control(cmd, db_id) {
  $('#main_admin_control').find('input[name=appCmd]').val(cmd);
  $('#main_admin_control').find('input[name=dbid]').val(db_id);
  $('#main_admin_control').submit();
}
$(document).ready(function() {
    if (($('#database_module')) && ($('#database_module').length))  {
        loadDBModule();
    }
});

function loadDBModule(cdb) {
  console.log({cmd:'getDBModule', module: (!cdb) ? '' : (cdb === 'new') ? 'addDB' : 'editDB'});
    $.post( "/admin/api/api.api", {cmd:'getDBModule', module: (!cdb) ? '' : (cdb === 'new') ? 'addDB' : 'editDB'})
      .done(function( data ) {
        $('#database_module').html(data);
    }); 
}
