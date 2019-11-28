var client;
window.storageData = {
  'ticket' : null,
  'conversation' : null,
  'status' : [],
  'names' : [],
  'responder' : null,
  'agent_name' : null
}

$(document).ready( function() {
    app.initialized()
        .then(function(_client) {
          window.client = _client;
          client.events.on('app.activated',
          function() {
              getcontactdeatils()
        });
    });
});

// reply_cc_emails: []
// requester_id: 47014379647
// responder_id: 47014379641
function getcontactdeatils(){
  client.data.get('contact')
        .then(function(data) { 
          console.log("contact : ", data)    
          window.storageData.names.push(data.contact.name)     
        })
        .catch(function(e) {
          console.log('Exception - ', e);
        });
        getticketdetails()
}

function getticketdetails(){
  console.log("Im here")
    client.data.get('ticket')
        .then(function(data) {
          console.log(data)
          ticket_data = {
            ticket_data_id : data.ticket.id,
            subject : data.ticket.subject,
            ticket : data.ticket.description_text,
            created_at : data.ticket.created_at
          }
            window.storageData.status.push(1)
            window.storageData.responder = data.ticket.responder_id
            console.log("Ticket data...")
            console.log(ticket_data)
            window.storageData.ticket = ticket_data
            
            getconvodetails()
        })
  .catch(function(e) {
    console.log('Exception - ', e);
  });
}

function getconvodetails(){
  // /api/v2/contacts/[id]
    console.log("++++++++++ ", window.storageData.responder)
    var headers = {"Authorization": "QmZIYWRuQjZRU01oeHVVNmVwVQ==", 'Content-Type': 'application/json'};
    var body = JSON.stringify({view_all_tickets: null  });
    var options = { headers: headers  };
    // var url = `https://sahithi37.freshdesk.com/api/v2/contacts/`;
    var url = `https://sahithi37.freshdesk.com/api/v2/agents/${window.storageData.responder}`
    client.request.get(url, options)
        .then (
        function(data) {
          var res=JSON.parse(data.response);
          console.log("req ",res)
          window.storageData.agent_name = res.contact.name
          getticketconvo();
          // getsummary()
        })
}

function getticketconvo(){
    ticket_data = window.storageData.ticket
    var headers = {"Authorization": "QmZIYWRuQjZRU01oeHVVNmVwVQ==", 'Content-Type': 'application/json'};
    var options = { headers: headers };
    var url = `https://sahithi37.freshdesk.com/api/v2/tickets/${ticket_data.ticket_data_id}/conversations`;
    client.request.get(url, options)
        .then (
        function(data) {
          data_ = JSON.parse(data.response)
          console.log("conversation ", JSON.parse(data.response));
          convo_body = []
          convo_created = []
          for(i = 0; i < data_.length; i++) {
              convo_body.push(data_[i].body_text)
              convo_created.push(data_[i].created_at)
              if(data_[i].private == true) {
                window.storageData.status.push(2)
              }
              else if(data_[i].private == false) {
                window.storageData.status.push(3)
              }
              if(data_[i].user_id == window.storageData.responder) {
                window.storageData.names.push(window.storageData.agent_name)
              }
            }
          conversation_data = {
              convo_body : convo_body,
              convo_created : convo_created
            }
          window.storageData.conversation = conversation_data
          loader()
        })
}

function openModal() {
  console.log("Im here")
   client.interface.trigger("showModal", {
      title: window.storageData.ticket.subject,
      template: "model.html",
      data: window.storageData

    }).then(function() {
    }).catch(function(error) {
  });
}

function loader(){
  document.getElementById('onboard').style.display = "block"
  document.getElementById('loader').style.display = "none"
}


