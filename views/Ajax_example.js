$('#submitID').on('click', function () {
  const val = $('#tags').val();
  $.ajax({
    url: '/habijabi',
    data: { val },
    method: 'POST'
  }).done(res => {
    console.log(res);
  })
});

$.ajax({
  url: '/habijabi',
  method: 'get'
}).done(res => {
  console.log(res);
})