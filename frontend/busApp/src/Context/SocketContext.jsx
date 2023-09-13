import React, { createContext, useContext } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const socket = io('http://localhost:443/');

const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;