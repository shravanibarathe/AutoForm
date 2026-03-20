import { useState, useEffect, useRef } from 'react';

export const useWebSocket = (url) => {
  const [wsStatus, setWsStatus] = useState('disconnected');
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
          console.log('WebSocket connected');
          setWsStatus('connected');
        };

        ws.current.onmessage = (event) => {
          console.log('WebSocket message:', event.data);
          setMessages(prev => [...prev, event.data]);
        };

        ws.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          setWsStatus('error');
        };

        ws.current.onclose = () => {
          console.log('WebSocket disconnected');
          setWsStatus('disconnected');
          
          // Auto-reconnect after 3s
          setTimeout(connectWebSocket, 3000);
        };
      } catch (e) {
        console.error("WS Connection error", e);
        setWsStatus('error');
      }
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
      console.log('Sent via WebSocket:', message);
    } else {
      console.error('WebSocket not connected');
    }
  };

  return { wsStatus, messages, sendMessage };
};
