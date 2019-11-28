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
    for(i = window.storageData.tickets.length - 1; i >= 0 ; i--){
    str += `<li>
              <div id=summary` + i + `>
                <div class="info">safdsgdhjyuk</div> 
                <div class="title">NAME</div>
              </div> <span class="number top"><span>` + getRelativeTime(new Date(window.storageData.created[i]).getTime()) + `</span></span>
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
  diff = Math.round(diff/1000)
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
