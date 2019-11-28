var client;
var showTotalSummary = false;
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
                <div class="info">safdsgdhjyuk<p>Rows are wrappers for columns. Each column has horizontal padding (called a gutter) for controlling the space between them. This padding is then counteracted on the rows with negative margins. This way, all the content in your columns is visually aligned down the left side.
</div> 
                <div class="type">` + getRelativeTime(new Date(window.storageData.created[0]).getTime()) + `</div>
                <div class="title">NAME</div>
              </div> <span class="number top">` + getRelativeTime(new Date(window.storageData.created[0]).getTime()) + `</span>
            </li>`
  }
  document.getElementById('summary').innerHTML = str
}

function getRelativeTime(time) {
  let min = 60;
  let hour = 3600;
  let day = 86400;
  let month = 2592000;  
  let year = 31536000;
  let diff = new Date().getTime() - time;
  if(diff < min) {
    return `${diff} seconds ago.`;
  } else if (diff < hour) {
    return `${Math.ceil(diff / min)} minutes ago.`;
  } else if (diff < day) {
    return `${Math.ceil(diff / hour)} hours ago.`;
  } else if (diff < month){
    return `${Math.ceil(diff/day)} days ago`;
  } else if (diff < year){
    return `${Math.ceil(diff/month)} months ago`;
  } else {
    return `${Math.ceil(diff/year)} years ago`;
  }
}

function showTotalSummary() {
  document.getElementById('total-summary').style.display = 'block';
  document.getElementById('summary').style.display = 'none';
}
