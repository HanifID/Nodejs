function planify(data) {
    for (var i = 0; i < data.columns.length; i++) {
        column = data.columns[i];
        column.searchRegex = column.search.regex;
        column.searchValue = column.search.value;
        delete(column.search);
    }
}

$(function () {
    $('.select-basic-single').select2({
      dropdownAutoWidth: true,
      dropdownParent: $('#carModal')

    });

    console.log('car crud');
    loadEmployeeName();
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
            "url": "/api/car",
            "method":"get",
            "data": function(data) {
                planify(data);
            },
            "dataSrc": function (response) {
                var data = response.data;
                console.log(response);
                var all = [];
                for (var i = 0; i < data.length; i++) {
                    var row = {
                        rows: i + 1,
                        id: data[i].id, // name ... ,
                        brand: data[i].brand, // name ... ,
                        name: data[i].name,
                        year: data[i].year,
                        action: '<button type="button" class="btn btn-danger delete" data-id="'+data[i].id+'" title="Delete Data"><i class="bi bi-trash"></i></button> <button type="button" class="btn btn-success edit" data-bs-toggle="modal" data-bs-target="#carModal" data-id="'+data[i].id+'" title="Edit"><i class="bi bi-pencil-square"></i></button> <button type="button" class="btn btn-primary inhouse" data-bs-toggle="modal" data-bs-target="#inHouseModal" data-id="'+data[i].id+'" title="In House"><i class="bi bi-house"></i></button>'
                    };
                    all.push(row);
                }
                return all;
            }
        },
        "columns" : [
            {"data":"id"},
            {"data":"brand"},
            {"data":"name"},
            {"data":"year"},
            {"data":"action"}
        ],
        "columnDefs": [{
           'targets': 0,
           'orderable': true,
           'render': function (data, type, full, meta){
               return '<input type="checkbox" name="id[]" value="' + $('<div/>').text(data).html() + '">';
           }
        }]
    });

    $('#mainTable tbody').on( 'click', '.delete', function () {
            var id = $(this).data('id');

            $.confirm({
                title: 'Delete',
                content: 'Do you want to delete this data ?',
                type: 'red',
                buttons: {
                    ok: {
                        text: "ok!",
                        btnClass: 'btn-primary',
                        keys: ['enter'],
                        action: function(){
                              $.ajax({
                               url: "/api/car",
                               data: {id:id},
                               type: "delete", //send it through delete method
                               success: function(response) {
                                     window.location.reload();
                               },
                               error: function(xhr) {
                                  console.log(xhr);
                               }
                             });
                        }
                    },
                    cancel: function(){
                            console.log('the user clicked cancel');
                    }
                }
            });
       } );

     $('#select-all').on('click', function(){
        var rows = table.rows({ 'search': 'applied' }).nodes();
        $('input[type="checkbox"]', rows).prop('checked', this.checked);
     });

     $('#mainTable tbody').on('change', 'input[type="checkbox"]', function(){
        if(!this.checked){
           var el = $('#select-all').get(0);
           if(el && el.checked && ('indeterminate' in el)){
              el.indeterminate = true;
           }
        }
     });

     $('#delete').on( 'click', function () {
            var checked = $('input[type="checkbox"]:checked').length;
            if(checked == 0){
                $.alert({
                    title: 'Delete',
                    content: 'Please select one data to delete!',
                });
                e.preventdefault();
            }

           var ids = {};
           var ids = table.$("input:checkbox:checked").map(function() {
              return $(this).val();
          }).get();

          $.confirm({
              title: 'Delete?',
              content: 'Do you want to delete the data ?',
              type: 'green',
              buttons: {
                  ok: {
                      text: "Yes!",
                      btnClass: 'btn-primary',
                      keys: ['enter'],
                      action: function(){
                           $.ajax({
                               method: "post",
                               traditional: true,
                               url: "/deleteCars",
                               headers: { 'X-CSRF-TOKEN': csrfToken },
                               data : {ids:ids},
                               success: function(response) {
                                     window.location.reload();
                               },
                               error: function(xhr) {
                                  console.log(xhr);
                               }
                             });
                      }
                  },
                  cancel: function(){
                          console.log('the user clicked cancel');
                  }
              }
          });

     } );

     $('#mainTable tbody').on( 'click', '.edit', function () {
        var id = $(this).data('id');
        $.ajax({
        type: "GET",
        url:"/api/car/"+id,
        traditional: true,
        success: function( res) {
             $('#carModalLabel').html('Update Car');
             $('#carId').val(res.data.id);
             $('#brand').val(res.data.brand);
             $('#carName').val(res.data.name);
             $('#carYear').val(res.data.year);
             $('#employeeName').val(res.data.owner);
             $('#employeeName').trigger('change');
             $('button[type="submit"]').html('<i class="bi bi-save"></i> Update');
             console.log(res);
         },
        error: function( jqXhr, textStatus, errorThrown ){
                 console.log( errorThrown );
         }
      });
     });


     $('#mainTable tbody').on( 'click', '.inhouse', function () {
             var id = $(this).data('id');
             $.ajax({
             type: "GET",
             url:"/getCarInHouse",
             traditional: true,
             data : {id:id},
             success: function( data) {
                  $('#inHouseModal #carId').val(data.id);
                  $('#inHouseModal #brand').val(data.brand);
                  $('#inHouseModal #carName').val(data.carName);
                  $('#inHouseModal #address').val(data.address);
                  $('#inHouseModal #employeeName').val(data.owner);
                  console.log(data);
              },
             error: function( jqXhr, textStatus, errorThrown ){
                      console.log( errorThrown );
              }
           });
          });

     $('#btnAdd').on('click', function(){
         $('#carModalLabel').html('New Car');
         $('#carId').val(null);
         $('#brand').val('');
         $('#carName').val('');
         $('#employeeName').val('')
         $('#employeeName').trigger('change');
         $('button[type="submit"]').html('<i class="bi bi-save"></i> Save');
     })
});

var csrfToken = $("input[name='_csrf']").val()
var adminLogin = $("#admin-login").val()

$('#carForm').on('submit', function(){
   var id = $('#carId').val();
   if(id){
        update(id);

   }else{
       save();
   }
})


function save() {
    var formData = {
         brand: $('#brand').val(),
         name: $('#carName').val(),
         year: $('#carYear').val() ? $('#carYear').val() : null,
         owner: $("#employeeName").val()
     };

    $.ajax({
        type: "POST",
        url:"/api/car",
        dataType: "json",
        // headers: { 'X-CSRF-TOKEN': csrfToken },
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function( data) {

         },
        error: function( jqXhr, textStatus, errorThrown ){
                 console.log( errorThrown );
         }
      });
}


function update(id) {
    var formData = {
         id: id,
         brand: $('#brand').val(),
         name: $('#carName').val(),
         year: $('#carYear').val() ? $('#carYear').val() : null,
         owner: $("#employeeName").val()
     };

    $.ajax({
        type: "PUT",
        url:"/api/car",
        dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function( data) {

         },
        error: function( jqXhr, textStatus, errorThrown ){
                 console.log( errorThrown );
         }
      });
}


function loadEmployeeName(){
        $.ajax({
        type: "GET",
        url:"/api/employeeName"
        })
        .done(function (response) {
            var n = '';
            for (var i=0;i<response.data.length;i++){
                n += '<option value ='+response.data[i].id+'> '+response.data[i].full_name +'</option>';
            }
            $("#employeeName").append(n);
        });
 }

$('#test').on("click", function () {
//    save()
})



