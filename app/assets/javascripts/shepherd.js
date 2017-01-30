var Tether = require('tether');
var Shepherd = require('tether-shepherd');
var axios = require('axios');

var shepherd = module.exports =  {
  start: function() {
    var tour = new Shepherd.Tour({
      defaults: {
        classes: 'shepherd-theme-arrows',
        scrollTo: false
      }
    });

    axios.get('/users/current')
    .then(function(res) {
      var user = res.data.user;
      user.tour_steps = JSON.parse(user.tour_steps);
      console.log(res);

      if(user.tour = true) {
        user.tour_steps.map(function(step, index) {
          if(step.done !== true) {
            step.classes = 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text';
            step.buttons = [
              {
                text: 'Next',
                action: function() {
                  user.tour_steps[index].done = true;
                  console.log(user.tour_steps[index]);

                  axios.put('/users/' + user.id + '/tour')
                    .then(function(res) {
                      console.log(res);
                    }, function(err) {
                      console.log(err);
                    })
                }
              }
            ]

            var selector = step.attachTo.split(" ")[0];

            if($(selector).length > 0 ) {
              tour.addStep(step.title.toLowerCase().replace(' ', '_'), step);
            }
          }
        });

        tour.start();
      }
    });
    // $.ajax({
    //   type: 'GET',
    //   dataType: 'json',
    //   url: '/users/current'
    // }).done(function(res) {
    //   var user = res.user;
    //   user.tour_steps = JSON.parse(user.tour_steps);
    //
    //   }
    //
    // }, function(err) {
    //   console.log(err);
    // });
  }
}
