/* Consulta a EasyBuyAI */

function openSweetAlertToCompare() {   
    /* Aqui creo el SweetAlert */
    Swal.fire({
      title: "What do you need this product for?",
      text: "Esta información nos ayudará a encontrar el mejor producto para ti!",
      html: '<input type="text" id="extraDataInput" class="form-control mb-4" placeholder="Enter Extra Data">',
      showCancelButton: true,
      confirmButtonText: 'Compare',
      cancelButtonText: 'Cancel',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-secondary'
      }
    }).then((result) => {
      if (result.isConfirmed) {
    /* Muestro el Spinner */
    document.getElementById('spinner').style.display = 'block';
    
        var extraData = $('#extraDataInput').val().trim();
        var productos = [];

        /* Chequeo las clases card-box-div que tengan el checkbox chequeado */

        $('.card-box-div input[type=checkbox]:checked').each(function () {
          var card = $(this).closest('.card-box-div');
          
          /* Obtengo los diferentes datos de los productos, aqui puede ingresar todos los datos que crea necesarios para que EasyBuyAI pueda comparar eficientemente */
          var productName = card.find('.card-title').text().trim();
          var productPrice = card.find('.card-price').text().trim();
          var productDescription = card.find('.card-description').text().trim();
          
          /* Concateno en un String todos los datos de los productos */
          var productInfo = productName + ' Price: ' + productPrice + ' Description: ' + productDescription;
          
          /* Guardo el String en un slot de productos */
          productos.push(productInfo);
        });

        // Crear objeto de datos para la solicitud
        var requestData = {
          products: productos, // Productos a comparar
          extra_data: extraData, // Extra data ingresada por el cliente
          language: "EN" // Idioma solicitado para la response
        };

        // Endpoint del Servidor del cliente el cual realizará la consulta a EasyBuyAI - RapidAPI
        fetch('http://127.0.0.1:5000/send_request', {
          method: 'POST',
          mode: "cors",
          headers: {
            'Content-Type': 'application/json', 
            "Access-Control-Allow-Origin": "*"
          },
          body: JSON.stringify(requestData)
        })
        .then(response => {
          
          /* Si falla la response levanto un Error para que se controle como tal */
          if (!response.ok) {

            throw new Error('Error en la solicitud.');

          }
          return response.json();
        })
        .then(data => {
          
          /* Oculto el Spinner */
          document.getElementById('spinner').style.display = 'none';

          /* Obtengo la response de EasyBuyAI */
          document.getElementById('apiResponse').innerText = data['response'];

          /* Muestro la response en el Modal */
          $('#responseModal').modal('show');
                              
        })
        .then(() => {

          /* Cierro el Modal si el Usuario presiona sobre la X */
          $('#responseModal .btn-close').on('click', function() {
          $('#responseModal').modal('hide');

          /* Limpio el contenido del Modal */
          document.getElementById('apiResponse').innerText = '';
          });
        })
        .catch(error => {
          
          /* Oculto el Spinner */
          document.getElementById('spinner').style.display = 'none';
          
          /* Aqui manejo los Errores */
          console.error(error);
          alert('Error al enviar la solicitud. Verifica la consola para ver los detalles del error.');

        });
      } else {

        /* Si el usuario presiona afuera o en Cancelar logueo en consola */
        console.log("Se canceló la comparación.");
      }
    });
  }

