var client;
window.storageData = {
  tickets : null,
  created : null
};

$(document).ready( function() {
  app.initialized()
    .then(function(_client) {
      window.client = _client;
      client.instance.context().then(function(context){
        tickets = []
        created_dates = []
        tickets.push(context.data.ticket.ticket)
        created_dates.push(context.data.ticket.created_at)
        for(i = 0; i < context.data.conversation.convo_body.length; i++){
          tickets.push(context.data.conversation.convo_body[i])
          created_dates.push(context.data.conversation.convo_created[i])
        }
        window.storageData.tickets = tickets
        window.storageData.created = created_dates
        console.log(window.storageData)
        constructtimeline()
      });
    });
});

function constructtimeline(){
    str = ''
    for(i = 0; i < window.storageData.tickets.length; i++){
    str += `<li>
              <div>
                <div class="info">safdsgdhjyuk</div> 
                <div class="type">${window.storageData.created[i]}</div>
                <div class="title">NAME</div>
              </div> <span class="number"><span>10:00</span> <span>12:00</span></span>
            </li>`
  }
  document.getElementById('summary').innerHTML = str
}

// ${window.storageData.tickets[i]}
// 