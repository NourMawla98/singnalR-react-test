import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

function App() {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [clientKey, setClientKey] = useState(null);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7238/chat', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => "nour is testing"
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    newConnection.start()
        .then(() => console.log('SignalR Connected'))      
        .catch(err => console.log('SignalR Connection Error: ', err));

    //not necessary but just to make sure connection is established
    newConnection.on('ReceiveClientKey', (key) => {
      console.log('key: ' + key)
      setClientKey(key);
    });
    
    newConnection.on('ReceiveMessage', (message) => {
      console.log('message:' + message)
      setMessages(prevMessages => [...prevMessages, { message }]);
    });

    return () => {
      newConnection.stop();
    };
  }, []);

  return (
    <div>
      <div>
        <h1>Received Messages:</h1>
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;