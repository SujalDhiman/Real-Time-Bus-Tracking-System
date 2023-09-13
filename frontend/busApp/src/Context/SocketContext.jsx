import React, { createContext, useContext } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const socket = io('http://127.0.0.1:10000');

const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;