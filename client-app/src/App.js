import React, {useEffect, useState, useCallback, useRef} from 'react';

function App() {

  const wsRef = useRef(null);
  const connect = useCallback(() => {

    const hostName = process.env.REACT_APP_WEB_SOCKET_HOST_NAME;
    const port = process.env.REACT_APP_WEB_SOCKET_PORT;
    wsRef.current = new WebSocket(`ws://${hostName}:${port}`);
    wsRef.current.onopen = () => {
      console.log(`Connected to: ${hostName}:${port}`);
    };

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      message.metadata.receivedAt = Date.now() / 1000;
      setMessages((prevMessages) => [message, ...prevMessages]);
      console.log(message.metadata.generatedAt);
    };

    // ws.onclose = () => {
    //   console.log('Disconnected, attempting to reconnect');
    //   setTimeout(connect, 5000);  // Try to reconnect every 5 seconds
    // };

    wsRef.current.onerror = (error) => {
      console.error(`WebSocket error: ${error}`);
    };
  }, []);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    connect();

    // clean up function
    return () => {
      wsRef.current.close();
    };
  }, [connect, wsRef]);

  return (
    <div className="App">
      <h1>Received Messages</h1>
      {messages.map((message, index) => (
        <React.Fragment key={message.metadata.generatedAt}>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <img src={message.image} alt="" />
            <div>
              <p>Generated at: {new Date(message.metadata.generatedAt).toString()}</p>
              <p>Received at: {new Date(message.metadata.receivedAt).toString()}</p>
              <p>Latency: {message.metadata.receivedAt - message.metadata.generatedAt} ms</p>
            </div>
          </div>
          <br />
        </React.Fragment>
      ))}
    </div>
  );
}

export default App;