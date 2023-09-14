import React, { createContext, useContext } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const socket = io('https://mutually-noble-turtle.ngrok-free.app', {extraHeaders: {
    'ngrok-skip-browser-warning': 10,
  }});

const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;