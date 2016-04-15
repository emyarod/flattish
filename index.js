$(document).ready(function() {
  $.ajax({
    // url: 'style/main.scss'
    url: 'style/utils/_import.scss'
  })
  .done(function(data) {
    $('#target').html(data)
  })
});