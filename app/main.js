var client;
window.storageData = {
  
};

$(document).ready( function() {
  app.initialized()
    .then(function(_client) {
      window.client = _client;
      // client.instance.receive(
      //   function(event)  {
      //     let data_ = event.helper.getData();
      //     console.log("Data in modal :", data_)
      //     }
      // );
      client.instance.context().then(function(context){
        console.log(context)
      });
    });
});