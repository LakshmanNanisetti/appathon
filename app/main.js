var client;
var showTotalSummary = false;
window.storageData = {
  tickets : null,
  created : null,
  summary : null,
  status : []
};

$(document).ready( function() {
  app.initialized()
    .then(function(_client) {
      window.client = _client;
      client.instance.context().then(function(context){
        console.log("+++++++++++ ", context)
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
        window.storageData.status = context.data.status
        console.log(window.storageData)
        getmodeldata()
      });
    });
});

function getmodeldata(){
    var headers = {'Content-Type': 'application/json'};
    
    var url = `https://b2fcb035.ngrok.io/summary`;
    var body = JSON.stringify({data: window.storageData.tickets  });

    var options = { headers: headers, body: body };
   
    console.log("~~~~~~~~~ ", body)
    client.request.post(url, options)
        .then (
        function(data) {
          console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ",data)
          data_ = JSON.parse(data.response)
          window.storageData.summary = data_.summary
          console.log("The Summary ",data_.summary)
          constructtimeline()
          loader_model()
        });       
}

function changeCaseFirstLetter(params) {
  if(typeof params === 'string') {
          return params.charAt(0).toUpperCase() + params.slice(1);
  }
  return null;
}

function constructtimeline(){   
  // loader_model()
  let colorStatus = {
    1 : ['ticket-details__requestor'],
    2 : ['ticket-details__privatenote'],
    3 : ['ticket-details__item']
  };
    str = ''
    for(i = window.storageData.tickets.length - 1; i >= 0 ; i--){
    str += `<li class=${colorStatus[window.storageData.status[i]]}>
              <div id=summary` + i + `>
                <div class="info">${window.storageData.summary[i]}</div> 
                <div class="title">NAME</div>
              </div> <span class="number top"><span>` + getRelativeTime(new Date(window.storageData.created[i]).getTime()) + `</span></span>
            </li>`
  }
  str2 = ''
  for (i = 0; i < window.storageData.summary.length; i++)  {
    console.log("!!!!!!!!!!!!!!", window.storageData.summary[i])
    str2 += changeCaseFirstLetter(window.storageData.summary[i])

  }
  console.log("The string ", str2)

  document.getElementById('overall-summary').innerHTML = str2
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

function loader_model(){
  document.getElementById('onboard').style.display = "block"
  document.getElementById('loader_model').style.display = "none"
}