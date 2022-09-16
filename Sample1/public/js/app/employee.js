$(document).ready(function () {
    console.log('employee');
});

(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()

function planify(data) {
    for (var i = 0; i < data.columns.length; i++) {
        column = data.columns[i];
        column.searchRegex = column.search.regex;
        column.searchValue = column.search.value;
        delete(column.search);
    }
}

$(document).ready(function () {
    console.log('employee crud');
    var table = $('#mainTable').DataTable({
        "processing": true,
        "serverSide": true,
        "pageLength": 10,
        "searching": true,
        "info" : true,
        "search": {
            "return":true
        },
        "ajax": {
            "url": "/api/employees",
            "method":"get",
            "data": function(data) {
                planify(data);
            },
            "dataSrc": function (response) {
                var data = response.data; // your data list
                console.log(data);
                var all = [];
                for (var i = 0; i < data.length; i++) {

                    var hireDateNew = dateConvert( data[i].hire_date , 'DMYh')
                    var birthdateNew = dateConvert( data[i].birthdate , 'DMY')

                    var row = {
                        rows: response.start + i + 1,
                        id: data[i].id, // name ... ,
                        // status: data[i].username ? data[i].username.enabled :  '',
                        status: 'Na',
                        fullName: data[i].full_name, // name ... ,
                        username: data[i].username ? data[i].username:  '',
                        birthdate: birthdateNew,
                        biography: data[i].biography,
                        hireDate: hireDateNew,
                        wearGlasses: data[i].wear_glasses? 'yes' : 'no',
                        salary: data[i].salary,
                        action: '<button type="button" class="btn btn-info view" data-bs-toggle="modal" data-bs-target="#employeeModal" data-id="'+data[i].id+'" title="View"><i class="bi bi-eye"></i></button>'
                    };

                       if (row.status===1){
                           row.status = '<span class="text-success">Enabled</span>';
                       } else if (row.status===0) {
                           row.status = '<span class="text-danger">Disabled</span>';
                       }

                       if( adminLogin == 'true' ){
                            row.action =  '<button type="button" class="btn btn-info view" data-bs-toggle="modal" data-bs-target="#employeeModal" data-id="'+data[i].id+'" title="View"><i class="bi bi-eye"></i></button> <button type="button" class="btn btn-success edit" data-bs-toggle="modal" data-bs-target="#employeeModal" data-id="'+data[i].id+'" title="Edit"><i class="bi bi-pencil-square"></i></button>'
                       }

                    all.push(row);
                }
                return all;
            }
        },
        "columns" : [
            {"data":"id"},
            {"data":"status"},
            {"data":"fullName"},
            {"data":"username"},
            {"data":"birthdate"},
            {"data":"biography"},
            {"data":"hireDate"},
            {"data":"salary"},
            {"data":"wearGlasses"},
            {"data":"action"}
        ],
        "columnDefs": [{
           'targets': 0,
           'orderable': false,
           'render': function (data, type, full, meta){
               return '<input type="text"  value="' + $('<div/>').text(data).html() + '" hidden>';
           }
        }]
    });

     $('#mainTable tbody').on( 'click', '.edit', function () {
           $("#employeeForm :input").prop("disabled", false);
           emptyData()
           checkUser('')
           var id = $(this).data('id');
           fillData(id)
           $('#employeeModalLabel').html('Update Employee')
           $('#form-submit').html('<i class="bi bi-save"></i> Update')
        })

     $('#mainTable tbody').on( 'click', '.view', function () {
         emptyData()
         checkUser('')
         var id = $(this).data('id');
         fillData(id)
         $('#employeeModalLabel').html('View')
         $("#employeeForm :input").prop("disabled", true);
         $("#employeeForm :button").prop("disabled", false);
     })


     $('#btnAdd').on('click', function(){
         $('#employeeModalLabel').html('Add Employee')
         emptyData()
         checkUser('')
         $('#form-submit').html('<i class="bi bi-save"></i> Save')
         $("#employeeForm :input").prop("disabled", false);
     })

});

var csrfToken = $("input[name='_csrf']").val()
var adminLogin = $("#admin-login").val()
console.log(adminLogin)

function emptyData(){
     console.log("empty data")
     $('#employeeId').val('')
     $('#fullName').val('')
     $('#username').val('').prop("disabled", false)
     $('#enable').prop({"checked" : false, "disabled" : true})
     $('#birthdate').val(''),
     $('#biography').val(''),
     $('#hireDate').val(''),
     $('#wearGlasses').prop("checked", false)
     $('#salary').val('')
     tinymce.get("biography").setContent('');
}

function fillData (id) {
 $.ajax({
    type: "GET",
    url:"/getEmployee/"+id,
    success: function( data) {

        if (data.biography === "" || data.biography === null){
            tinymce.get("biography").setContent('');
        } else {
            tinymce.get("biography").setContent(data.biography);
        }

        var hireDateNew = dateConvert( data.hireDate , 'DMYh')
        var birthdateNew = dateConvert( data.birthdate , 'DMY')


        $('#employeeId').val(data.id);
        $('#fullName').val(data.fullName),
        data.username === "" ?  $('#username').val('').prop("disabled", false) : $('#username').val(data.username).prop("disabled",true)
        data.enabled ? data.enabled === "1" ? $('#enable').prop("checked", true) : $('#enable').prop("checked", false) : $('#enable').prop("checked", false)
        $('#birthdate').val(birthdateNew),
        $('#biography').val(data.biography),
        $('#hireDate').val(hireDateNew),
        data.wearGlasses === "1" ? $('#wearGlasses').prop("checked", true) : $('#wearGlasses').prop("checked", false),
        $('#salary').val(data.salary)
         checkDisable()
     },
    error: function( jqXhr, textStatus, errorThrown ){
             console.log( errorThrown );
     }
  });
}


function checkUser(user) {
    $('#username').removeClass('is-invalid');
    $('.user-exist').empty()
    if(user != ""){
     $.ajax({
            type: "GET",
            url:"/getUser/"+user,
            dataType: "json",
            contentType: 'application/json',
            success: function( data) {
                console.log(data);
                if (data.length==1){
                    $('#username').addClass('is-invalid');
                    $('.user-exist').html('<span class="text-danger">username already exist!</span>');
                }
            },
            error: function( jqXhr, textStatus, errorThrown ){
                 return errorThrown;
             }
      });
    }
}

function save() {
    var dHire = dateConvert( $('#hireDate').val() , 'UTC')
    var dBirth = dateConvert( $('#birthdate').val() , 'YMD')

    var user_name = {
        id: $('#username').val(),
        enabled: $('#enable').is(":checked") ? 1 : 0,
        password: ''
    };

    var biographyContent = tinymce.get("biography").getContent();

    var formData = {
        fullName: $('#fullName').val(),
        birthdate: dBirth,
        biography: biographyContent,
        hireDate: dHire,
        wearGlasses: $('#wearGlasses').is(":checked") ? 1 : 0,
        salary: $('#salary').val(),
     };

    if ($('#username').val() !== "" ){
        formData['username'] = user_name
    }

    $.ajax({
        type: "POST",
        url:"/addEmployee",
        dataType: "json",
        headers: { 'X-CSRF-TOKEN': csrfToken },
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function( data ) {
            console.log(data)
         },
        error: function( jqXhr, textStatus, errorThrown ){
                 console.log( errorThrown )
         }
      });
}

function update (id) {
    var dHire = dateConvert( $('#hireDate').val() , 'UTC')
    var dBirth = dateConvert( $('#birthdate').val() , 'YMD')

    var user_name = {
        id: $('#username').val(),
        enabled: $('#enable').is(":checked") ? 1 : 0,
        password: ''
    };

    var biographyContent = tinymce.get("biography").getContent();

    var formData = {
        id: id,
        fullName: $('#fullName').val(),
        birthdate: dBirth,
        biography: biographyContent,
        hireDate: dHire,
        wearGlasses: $('#wearGlasses').is(":checked") ? 1 : 0,
        salary: $('#salary').val(),
        fullName: $('#fullName').val()
    }
      if ($('#username').val() !== "" ){
         formData['username'] = user_name
        }

  $.ajax({
        type: "POST",
        url:"/updateEmployee",
        dataType: "json",
         headers: { 'X-CSRF-TOKEN': csrfToken },
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function( data ) {
            console.log(data)
         },
        error: function( jqXhr, textStatus, errorThrown ){
                 console.log( errorThrown )
         }
      });
}

function checkDisable(){
    if ( $('#username').val() ==='') {
        $('#enable').prop("disabled", true)
      } else {
        $('#enable').prop("disabled", false)
      }
}

function dateConvert (date, type) {
    var dDate =''

    if(date != '') {
        if(type=='UTC') {
            dDate = new Date(date).toISOString();
        } else if (type=='YMD'){
            dDate = new Date(date).toString('yyyy-MM-dd')
        } else if (type=='DMYh'){
            dDate = new Date(date).toString('dd-MMM-yyyy hh:MM')
        } else {
            dDate = new Date(date).toString('dd-MMM-yyyy')
        }
    }

    return dDate
}

$('#employeeForm').on('submit', function(event){
  var id = $('#employeeId').val();
  var invalid = $('.is-invalid')
  if (invalid.length>0){
            event.preventDefault()
   } else {
    if(id){
         update(id);
     }else{
         save()
     }
   }
})

$("#username").change(function(){
  checkUser( $("#username").val() );
  checkDisable()
});

$('#btnTest').on('click', function(){
//    save()
})



tinymce.init({
  selector: 'textarea#biography',
  plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
  editimage_cors_hosts: ['picsum.photos'],
  menubar: 'file edit view insert format tools table help',
  toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview | insertfile image media template link anchor codesample | ltr rtl',
  toolbar_sticky: true,
  autosave_interval: '30s',
  autosave_prefix: '{path}{query}-{id}-',
  autosave_restore_when_empty: false,
  autosave_retention: '2m',
  image_advtab: true,
  image_class_list: [
    { title: 'None', value: '' },
    { title: 'Some class', value: 'class-name' }
  ],
  importcss_append: true,
  file_picker_callback: (callback, value, meta) => {
    /* Provide file and text for the link dialog */
    if (meta.filetype === 'file') {
      callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
    }

    /* Provide image and alt text for the image dialog */
    if (meta.filetype === 'image') {
      callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
    }

    /* Provide alternative source and posted for the media dialog */
    if (meta.filetype === 'media') {
      callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg' });
    }
  },
  templates: [
    { title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
    { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
    { title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
  ],
  template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
  template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
  height: 300,
  image_caption: true,
  quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
  noneditable_class: 'mceNonEditable',
  toolbar_mode: 'sliding',
  contextmenu: 'link image table',
  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
});

document.addEventListener('focusin', (e) => {
  if (e.target.closest(".tox-tinymce, .tox-tinymce-aux, .moxman-window, .tam-assetmanager-root") !== null) {
    e.stopImmediatePropagation();
  }
});