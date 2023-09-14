import React, { createContext, useContext } from 'react';
import { io } from 'socket.io-client';
import { socket_url } from '../constant/constants';

export const SocketContext = createContext();

const socket = io(socket_url);

const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;