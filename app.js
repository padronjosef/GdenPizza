'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const access_token = 'EAAFFEDIM5ZBEBAIebl6by9SwJ3g8rDehAmXbNZBwraMtgUwMV2wu0hgZBZAQSiMv1pplifGO1bxxMtBNzuh23KZAtyRS1WOrU6lmVEsKBmvZCFahZBcwJxwWrt0TErhDftBOQrnlbXct3FEDMaRKlfCaZCtSX8zQo2ZBZCZC3LwZBac70fGdkyCgtP4t'

const app = express();

app.set('port', (process.env.PORT || 5000 ));
app.use(bodyParser.json());

app.get('/', function(req, response){
  response.send('Hola Mundo!');
})

app.get('/webhook', function(req, response){
  if(req.query['hub.verify_token'] === 'gdenpizza_token'){
    response.send(req.query['hub.challenge']);
  } else {
    response.send('Pug Pizza no tienes permisos.');
  }
});

app.post('/webhook/', function(req, res){
  const webhook_event = req.body.entry[0];
  if(webhook_event.messaging) {
    webhook_event.messaging.forEach(event => {
      handleEvent(event.sender.id, event);
    });
  }
  res.sendStatus(200);
});

function handleEvent(senderId, event){
  if(event.message){
    handleMessage(senderId, event.message)
  }else if(event.postback){
    handlePostback(senderId, event.postback.payload)
  }
}

function handleMessage(senderId, event){
  if(event.text){
    getLocation(senderId);
  }else if (event.attachments){
    handleAttachments(senderId, event)
  }
}

function defaultMessage(senderId) {
  const messageData = {
    "recipient": {
      "id": senderId
    },
    "message": {
      "text": "Hola soy un bot de messenger y te invito a utilizar nuestro menu",
      "quick_replies": [
        {
          "content_type": "text",
          "title": "¿Quieres una Pizza?",
          "payload": "PIZZAS_PAYLOAD"
        },
        {
          "content_type": "text",
          "title": "Acerca de",
          "payload": "ABOUT_PAYLOAD"
        }
      ]
    }
  }
  senderActions(senderId)
  callSendApi(messageData);
}

function handlePostback(senderId,payload){
  console.log(payload)
  switch(payload){
    case "GET_STARTED_GDENPIZZA":
      console.log(payload)
    break;
    case "PIZZAS_PAYLOAD":
      showPizzas(senderId);
    break;
    case "PEPERONI_PAYLOAD":
      sidePizza(senderId);
    break;
  }
}

function senderActions(senderId) {
  const messageData = {
    "recipient": {
      "id": senderId
    },
    "sender_action": "typing_on"
  }
  callSendApi(messageData)
}

function handleAttachments(senderId, event){
  let attachment_type = event.attachments[0].type;
  switch (attachment_type) {
    case "image":
      console.log(attachment_type);
    break;
    case "video": 
      console.log(attachment_type);
    break;
    case "audio": 
      console.log(attachment_type);
    break;
    case "file": 
      console.log(attachment_type);
    break;
    case "location":
      console.log(JSON.stringify(event));
    default: 
      console.log(attachment_type);
    break;
  }
}

function callSendApi(response) {
  request({
    "uri": `https://graph.facebook.com/v3.2/me/messages?access_token=${access_token}`,
    'method': "POST",
    "json": response
  },
  function (err) {
    if (err) {
      console.log('Ha ocurrido un error')
    } else {
      console.log('Mensaje enviado')
    }
  }
  )
}

function showPizzas(senderId) {
  const messageData = {
    "recipient": {
      "id": senderId
    },
    "message": {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [
            {
              "title": "Peperoni",
              "subtitle": "Con todo el sabor del peperoni",
              "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg",
              "buttons": [
                {
                  "type": "postback",
                  "title": "Elegir Peperoni",
                  "payload": "PEPERONI_PAYLOAD"
                }
              ]
            },
            {
              "title": "POLLO BBQ",
              "subtitle": "Con todo el sabor del BBQ",
              "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg",
              "buttons": [
                {
                  "type": "postback",
                  "title": "Elegir Pollo BBQ",
                  "payload": "BQQ_PAYLOAD"
                }
              ]
            }
          ]
        }
      }
    }
  }
  callSendApi(messageData)
}

function messageImage(senderId) {
  const messageData = {
    "recipient": {
      "id": senderId
    },
    "message": {
      attachment: {
        "type": "image",
        "payload": {
          "url": "https://media.giphy.com/media/1dOIvm5ynwYolB2Xlh/giphy.gif"
        }
      }
    }
  }
  callSendApi(messageData);
}

function contactSupport(senderId) {
  const messageData = {
    "recipient": {
      "id": senderId
    },
    "message": {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": "Hola este es el canal de soporte, ¿Quieres Llamarnos?",
          "buttons": [
            {
              "type": "phone_number",
              "title": "Llamar a un asesor",
              "payload": "+573125422185"
            }
          ]
        }
      }
    }
  }
  callSendApi(messageData);
}

function showLocations(senderId) {
  const messageData = {
    "recipient": {
      "id": senderId
    },
    "message": {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "list",
          "top_element_style": "large",
          "elements": [
            {
              "title": "sucursal Bogota",
              "image_url": "https://media.giphy.com/media/1dOIvm5ynwYolB2Xlh/giphy.gif",
              "subtitle": "direccion random  #123",
              "buttons": [
                {
                  "title": "Ver en el mapa",
                  "type": "web_url",
                  "url": "https://www.google.com.co/maps/@4.6781327,-74.0601495,15z?hl=en&authuser=0",
                  "webview_height_ratio": "full"
                }
              ]
            },
            {
              "title": "sucursal Barranquilla",
              "image_url": "https://media.giphy.com/media/1dOIvm5ynwYolB2Xlh/giphy.gif",
              "subtitle": "direccion random  #391",
              "buttons": [
                {
                  "title": "Ver en el mapa",
                  "type": "web_url",
                  "url": "https://www.google.com.co/maps/@4.6781327,-74.0601495,15z?hl=en&authuser=0",
                  "webview_height_ratio": "tall"
                }
              ]
            }
          ]
        }
      }
    }
  }
  callSendApi(messageData);
}

function sidePizza(senderId) {
  const messageData = {
    "recipient": {
      "id": senderId
    },
    "message": {
      attachment: {
        "type": "template",
        "payload": {
          "template_type": "list",
          "top_element_style": "large",
          "elements": [
            {
              "title": "individual",
              "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg",
              "subtitle": "posicion individual de pizza",
              
              //boton que va a desencadenar esta opcion que el usuario va a elegir
              "buttons": [
                {
                  "type": "postback",
                  "title": "elegir individual",
                  "payload": "PERSONAL_SIZE_PAYLOAD"
                }
              ]
            },
            {
              "title": "Mediana",
              "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg",
              "subtitle": "posicion mediana de pizza",
              "buttons": [
                {
                  "type": "postback",
                  "title": "elegir mediana",
                  "payload": "MEDIUM_SIZE_PAYLOAD"
                }
              ]
            }
          ]
        }
      }
    }
  }
  callSendApi(messageData);
}

function receipt(senderId) {
  const messageData = {
    "recipient": {
      "id": senderId
    },  
    "message": {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "receipt",
          "recipient_name": "Jose Padron",
          "order_number": "123123",
          "currency": "COP",
          "payment_method": "Efectivo",
          "order_url": "https://platzi.com/order/123",
          "timestamp": "123123123",
          "address": {
            "street_1": "Mazuren HD",
            "street_2": "---",
            "city": "Bogota",
            "postal_code": "543135",
            "state": "Cundinamarca",
            "country": "Colombia"
            },
          "summary": {
            "subtotal": 25000.00,
            "shipping_cost": 5000.00,
            "total_tax": 1000.00,
            "total_cost": 30000.00
          },
          "adjustments": [
            {
              "name": "Descuento frecuente",
              "amount": 1000.00
            }
          ],
          "elements": [
            {
              "title": "Pizza Pepperoni",
              "subtitle": "La mejor pizza de pepperoni",
              "quantity": 1,
              "price": 25000.00,
              "currency": "COP",
              "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg"
            },
            {
              "title": "Bebida",
              "subtitle": "Coca-Cola 2 Litros",
              "quantity": 1,
              "price": 5000.00,
              "currency": "COP",
              "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg"
            }
          ]
        }
      }
    }
  }
  callSendApi(messageData);
}

function getLocation(senderId) {
  const messageData = {
    "recipient": {
      "id": senderId
    },
    "message": {
      "text": "Ahora ¿puedes proporcionarnos tu ubicacion?",
      "quick_replies": [
        {
          "content_type": "location"
        }
      ]
    }
  }
  callSendApi(messageData)
}

app.listen(app.get('port'), function() {
  console.log('Nuestro servidor esta funcionando en el puerto', app.get('port'));
})
