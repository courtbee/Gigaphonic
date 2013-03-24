//= require lib/jquery-1.9.1

$(document).ready(function() {
   SC.initialize({
     client_id: '3bac0c7e3cff7e9c3a0fd3bbbb57718c',
     redirect_uri: 'http://localhost:5000/'
   });
   
   $("#record").click(function() {
      SC.connect(function() {
        SC.record({
          start: function() {
            window.setTimeout(function() {
              SC.recordStop();
              SC.recordUpload({
                track: { title: 'This is my sound' }
              });
            }, 5000);
          }
        });
      });

      return false;
   })
});
