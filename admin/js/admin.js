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
    $.post( "/admin/api/api.api", {
          cmd:'getDBModule', 
          module: (!cdb) ? '' : (cdb === 'new') ? 'addDB' : 'editDB',
          cdb : (cdb === 'new') ? '' : cdb})
      .done(function( data ) {
        $('#database_module').html(data);
    }); 
}
function saveDBCFG() {
    var formData = {dbid : $('#DBCFG_FORM')[0].dbid.value, host : $('#DBCFG_FORM')[0].host.value, 
                user : $('#DBCFG_FORM')[0].user.value, password : $('#DBCFG_FORM')[0].password.value, 
                database : $('#DBCFG_FORM')[0].database.value};

    $.post( "/admin/api/api.api", {
          cmd:'saveDBCFG', 
          formData: formData})
      .done(function( data ) {
        $('#database_module').html(JSON.stringify(data));
    }); 
}
