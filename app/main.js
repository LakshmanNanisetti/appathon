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
        window.storageData.ticket_id = context.data.ticket.ticket_data_id
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
  let ticket_id = window.storageData.ticket_id
  document.getElementById('summary').innerHTML = ''
    for(let i = window.storageData.tickets.length - 1; i >= 0 ; i--){
      let msg_content;
      console.log(`key: ticket-${ticket_id}-${i}`)
      window.client.db.get(`ticket-${ticket_id}-${i}`).then(
        
        function(data){
          let isEdited;
          msg_content = data['message'];
          if(msg_content){
            isEdited = true;
          }
          else {
            msg_content = window.storageData.summary[i]
            isEdited = false;
          }
          document.getElementById('summary').innerHTML += getDataForMsg(msg_content, i, ticket_id, isEdited);
        },
        function(error) {
          console.log('error - branch')
          msg_content = window.storageData.summary[i]
          document.getElementById('summary').innerHTML += getDataForMsg(msg_content, i, ticket_id, false)
          console.log(`li data ${getDataForMsg(msg_content, i, ticket_id)}`)
        }
      )
    // str += `<li class=${colorStatus[window.storageData.status[i]]} data-edited="">
    // <span class="data-edit-icon"><p>${getRelativeTime(new Date(window.storageData.created[i]).getTime())}</p> <a href="#" class="btn--default edit--icon"><img src="edit.svg" width="12" height="12" class="__icon"/> Edit</a></div></span>
    // <div class="info" id = 'info-msg-${i}' onclick='changeContentEdit(${i})' onkeyup='saveData(${i},${ticket_id})'>
    // ${window.storageData.summary[i]}</div>
    // `
  }
  
  
  window.client.db.get(`ticket-${ticket_id}-overall-summary`).then(
    function(data) {
       let overallSummary = data['message']
      if(!overallSummary) {
        overallSummary = getOverallSummaryModelData();
      }
      document.getElementById('overall-summary').innerHTML = overallSummary
    },
    function(error) {
      document.getElementById('overall-summary').innerHTML = getOverallSummaryModelData();
    }
  )
  // for (let j = 0; j < window.storageData.summary.length; j++)  {
  //   // console.log("!!!!!!!!!!!!!!", window.storageData.summary[j])
  //   str2 += changeCaseFirstLetter(window.storageData.summary[j])

  // }
  // console.log("The string ", str2)

  // document.getElementById('overall-summary').innerHTML = str2
  // document.getElementById('summary').innerHTML = str
}

function getOverallSummaryModelData() {
  let str2 = ''
  for (let j = 0; j < window.storageData.summary.length; j++)  {
    // console.log("!!!!!!!!!!!!!!", window.storageData.summary[j])
    str2 += changeCaseFirstLetter(window.storageData.summary[j])

  }
  return str2;
}

function getDataForMsg(msg_content, i, ticket_id, isEdited) {
  let colorStatus = {
    1 : ['ticket-details__requestor'],
    2 : ['ticket-details__privatenote'],
    3 : ['ticket-details__item']
  };
  console.log(`status: ${window.storageData.status[i]}`)
  return `
  <li class=${colorStatus[window.storageData.status[i]]} data-edited="${isEdited}">
    <span class="data-edit-icon" onclick='changeContentEdit(${i})'>
      <p>
        ${getRelativeTime(new Date(window.storageData.created[i]).getTime())}
      </p>
      <a href="#" class="btn--default edit--icon">
        <img src="edit.svg" width="12" height="12" class="__icon"/>
        Edit
      </a>
    </span>
    <div class="info" id = 'info-msg-${i}' onclick='changeContentEdit(${i})' onkeyup='saveData(${i},${ticket_id})'>
      ${msg_content}
    </div>
  </li>
    `
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

function changeContentEdit(i) {
  document.getElementById(`info-msg-${i}`).contentEditable = true
  document.getElementById(`info-msg-${i}`).focus()
}

function saveData(i, ticket_id) {
  let msg = document.getElementById(`info-msg-${i}`).innerHTML
  window.client.db.set(`ticket-${ticket_id}-${i}`, {message: msg}).then(
    function(data){

    },
    function(error) {
      alert(error)
    }
  )
}

function makeOverallSummaryEditable() {
  document.getElementById('overall-summary').contentEditable = true;
  document.getElementById("overall-summary").focus();
}

function saveOverallSummary() {
  let ticket_id = window.storageData.ticket_id
  let msg = document.getElementById('overall-summary').innerHTML
  window.client.db.set(`ticket-${ticket_id}-overall-summary`, {message: msg}).then(
    function(data) {

    },
    function(error) {
      alert(error)
    }
  )
}