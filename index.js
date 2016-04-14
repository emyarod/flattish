$(document).ready(function() {
  $.ajax({
    url: 'style/main.scss'
  })
  .done(function(data) {
    $('#target').html(data)
  })
});