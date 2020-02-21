$('#submit').click(function () {
    $.ajax({
        type: 'POST',
        url: 'https://formsubmit.co/ajax/test@gmail.com',
        data: {
            message: $("#message").val(), name: $("#name").val(), subject: $("#subject").val()
        }
    }).done((response)=>{
        alert('Thanks for contacting us. We will contact you shortly!');
        $(':input','#main-contact-form')
          .not(':button, :submit, :reset, :hidden')
          .val('')
          .prop('checked', false)
          .prop('selected', false);
        console.log(response);
    }).fail((error)=>{
        console.log(error);
    });
});


$( function() {
    var availableTags = [
      "Morning",
      "Afternoon",
      "Evening",
      "Night",
      "Never"
    ];
    $("#contact-time").autocomplete({
      source: availableTags
    });
});


function getbulkPrice() {
  $.get("https://api.myjson.com/bins/1dpsfm")
	.then(function(products){ 		
		$('#price-tag').text(products[0].price);
		$('#store').text(products[0].store);
		$('#availability').text(products[0].availability);
		$('#product-size').val(products[0].productsize);
	});

};