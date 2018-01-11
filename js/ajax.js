
var proceso = new Object();
proceso.tipoPro = 1;
proceso.producto = new Array();
var table = new Array();
var cliente = new Object();

$(document).ready(function(){

  $("#search-proveedores").submit(function(e){
    e.preventDefault();
    $.ajax({
      url: $(this).attr('action'),
      type: $(this).attr('method'),
      data: $(this).serialize(),
      success: function(json){
        console.log(json)
        var html = ""
        if(json.length !=0){
          for (var i = 0; i <json.length; i++) {
            html += '<tr><td>'+json[i].id+ '</td><td>'+
  						json[i].nombreEmpresa+ '</td><td>'+
  						json[i].nombreRepresentante+'</td></tr>'
          }
          $("#datosC").html(html);
        }
        else {
          var msg = 'No existe provedores relacionados con el dato.'
          alert(msg);
        }
      }
    })
  })

  $('#c-buscar').submit(function(e){
    e.preventDefault();
    $.ajax({
      url: $(this).attr('action'),
      type: $(this).attr('method'),
      data: $(this).serialize(),
      success: function(json){
        console.log(json)
        var html = ""
        for (var i = 0; i < json.length; i++) {
          html += 'DNI: '+json[i].dni + '<br>';
          html += 'Empresa: '+json[i].nombreEmpresa + '<br>';
          html += 'Nombres: '+json[i].nombreRepresentante + '<br>';
          html += 'Apellidos: '+json[i].apellidoRepresentante + '<br>';

          cliente.dni = json[i].dni;
          cliente.nombreEmpresa = json[i].nombreEmpresa;
          cliente.nombreRepresentante = json[i].nombreRepresentante;
          cliente.apellidoRepresentante = json[i].apellidoRepresentante;
        }
        $('#clientes').html(html);
      }
    })
  })

$("#c-seleccionar").click(function(){
  proceso.clienProv = cliente.dni;
  $("#c-dni").text(cliente.dni);
  $("#c-nombreEmpresa").text(cliente.nombreEmpresa);
  $("#c-nombreRepresentante").text(cliente.nombreRepresentante);
  $("#c-apellidoRepresentante").text(cliente.apellidoRepresentante);
  // var tipoPago = $("#f-tipoPago").val();
  // var idMaquina = $("#f-maquinaid").val();
  // proceso.tipoPago = tipoPago;
  // proceso.idMaquina = idMaquina;
  //alert(texto);
  //alert(textot);
})


/*productos ajax*/
$('#p-buscar').submit(function(e){
  e.preventDefault();
  $.ajax({
    url: $(this).attr('action'),
    type: $(this).attr('method'),
    data: $(this).serialize(),
    success: function(json){
      console.log(JSON.stringify(json))
      var html = ""
      for (var i = 0; i < json.length; i++) {
        html += 'Codigo: '+json[i].fields.codigo + '<br>';
        html += 'Producto: '+json[i].fields.producto + '<br>';
        html += 'IVA: '+json[i].fields.valorIva + '<br>';
        html += 'valor Venta: '+json[i].fields.valorVenta + '<br>';
        html += '<label> Valor venta </label> <input name="p-valorVenta" id="p-valorVenta" type="number" min="1" max="50000000" step="500" value=0 autocomplete="off" required="required"><br>';
        html += '<label> Cantidad </label> <input name="p-cantidad" id="p-cantidad" type="number" min="1" max="200" step="1" value=1 autocomplete="off" required="required"><br>';

        var fila = new Object();
        fila.codigo = json[i].fields.codigo;
        fila.producto = json[i].fields.producto;
        fila.valorIva = 0.19;
        /*fila.valorVenta = json[i].fields.valorVenta;*/
        fila.cantidad = 1;
        fila.valorVenta = 1;
        table.push(fila);
      }
      $('#productos').html(html);
    }
  })
})

$("#p-seleccionar").click(function(){
  var d = table;
  var t = document.getElementById('tb-detalle').getElementsByTagName('tbody')[0];
  var rowCount = t.rows.length;
  var row = t.insertRow(rowCount);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);

  cell1.innerHTML = d[d.length-1].codigo;
  cell2.innerHTML = d[d.length-1].producto;
  d[d.length-1].valorVenta = $('#p-valorVenta').val();
  cell3.innerHTML = d[d.length-1].valorVenta-(d[d.length-1].valorVenta * d[d.length-1].valorIva);
  d[d.length-1].cantidad = $('#p-cantidad').val();
  cell4.innerHTML = d[d.length-1].cantidad;
  cell5.innerHTML = (d[d.length-1].valorVenta * d[d.length-1].valorIva) * $('#p-cantidad').val();
  cell6.innerHTML = (d[d.length-1].valorVenta- d[d.length-1].valorIva)* $('#p-cantidad').val() +
                    d[d.length-1].valorIva * $('#p-cantidad').val();
  cell1.setAttribute('align','center');
  cell2.setAttribute('align','center');
  cell3.setAttribute('align','center');
  cell4.setAttribute('align','center');
  cell5.setAttribute('align','center');
  cell6.setAttribute('align','center');

  proceso.producto.push({'codigo': d[d.length-1].codigo, 'cantidad': d[d.length-1].cantidad, 'valorVenta': d[d.length-1].valorVenta});
  calTotal();
})

})//principal

//funciones aparte

function onEnviar(){
    //proceso.serie = $('#p-serie').val();
    //proceso.numero = $('#p-num').val();
    var tipoPago = $("#f-tipoPago").val();
    var idMaquina = $("#f-maquinaid").val();
    proceso.tipoPago = tipoPago;
    proceso.idMaquina = idMaquina;

    console.log(JSON.stringify(proceso));
    document.getElementById("proceso").value=JSON.stringify(proceso);
}

var total = 0;
function calTotal(){
    var total=0;
    var t=0;
    $('#tb-detalle tbody tr').each(function () {
      console.log(total);
        total = total*1 + $(this).find("td").eq(5).html()*1;
        console.log(total);
        t = t*1 + $(this).find("td").eq(4).html()*1;

    });
    $('#p-subtotal').text((total-t));
    $('#p-iva').text(t.toFixed(2));
    $('#p-total').text(total);
}
