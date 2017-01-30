require('libs');

var Central = require('./central');
var shepherd = require('./shepherd');

$(Central.start);
$(shepherd.start);

// $.ajax({
//   type: 'GET',
//   dataType: 'json',
//   success: function(resp, status, xhr) {
//     console.log(resp);
//     resp.user.tour_steps = 'Teste';
//
//   },
//   url: 'users/current'
// });
//
// $.ajax({
//   type: 'PUT',
//   dataType: 'application/json',
//   success: function(res) {
//     console.log(res);
//   },
//   data: {user: {tour_steps: "teste"}},
//   url: '/users/' + 2 + '/tour'
// });
