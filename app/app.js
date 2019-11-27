var client;
window.storageData = {
  'ticket' : null,
  'conversation' : null,
}

$(document).ready( function() {
    app.initialized()
        .then(function(_client) {
          window.client = _client;
          // getticketdetails()
          client.events.on('app.activated',
          function() {
              getticketdetails();
              // getcontactdeatils()
        });
    });
});

function getcontactdeatils(){
  client.data.get('contact')
        .then(function(data) { 
          console.log("contact : ", data)
          
        })
        .catch(function(e) {
          console.log('Exception - ', e);
        });
        getconvodetails()
}

// reply_cc_emails: []
// requester_id: 47014379647
// responder_id: 47014379641

function getconvodetails(){
  // /api/v2/contacts/[id]
    var headers = {"Authorization": "QmZIYWRuQjZRU01oeHVVNmVwVQ==", 'Content-Type': 'application/json'};
    var options = { headers: headers };
    var url = `https://sahithi37.freshdesk.com//api/v2/contacts/${47014379641}`;
    client.request.get(url, options)
        .then (
        function(data) {
          console.log("req ",JSON.parse(data.response))
          // getsummary()
        })
}


function getticketdetails(){
  console.log("Im here")
    client.data.get('ticket')
        .then(function(data) {
          console.log(data)
          ticket_data = {
            ticket_data_id : data.ticket.id,
            subject : data.ticket.subject,
            ticket : data.ticket.description,
            created_at : data.ticket.created_at
          }
            // console.log("subject :", subject,'\n', "ticket :", ticket,'\n', "created_at :", created_at)  
            console.log("Ticket data...")
            console.log(ticket_data)
            window.storageData.ticket = ticket_data
            getticketconvo()
        })
  .catch(function(e) {
    console.log('Exception - ', e);
  });
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
              convo_body.push(data_[i].body)
              convo_created.push(data_[i].created_at)
            }
          conversation_data = {
              convo_body : convo_body,
              convo_created : convo_created
            }
          window.storageData.conversation = conversation_data
          console.log("Going through the ticket conversations .... ")
          console.log()
          // getsummary()
        })
}

function getsummary(){
    str = `<p> Get to know the summary of this ticket conversation </p>
          <button onclick="openModal();" class="summary_button"> Summary </button>`
    document.getElementById('onboard').innerHTML = str;
}

function openModal() {
  console.log("Im here")
   client.interface.trigger("showModal", {
      title: "Sample Modal",
      template: "model.html",
      data: {ticket: window.storageData.ticket, conversation: window.storageData.conversation}

    }).then(function() {
      // client.instance.send({
      //   message: {ticket: window.storageData.ticket, conversation: window.storageData.conversation}
      // });
    // data - success message
    }).catch(function(error) {
    // error - error object
    });
}

// $('#apptext').text("Ticket created by " + data.contact.name);



// 

