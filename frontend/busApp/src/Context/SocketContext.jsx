import React, { createContext, useContext } from 'react';
import { io } from 'socket.io-client';
import {SERVER_URL} from "../Constants/config.js";

export const SocketContext = createContext();

const socket = io(SERVER_URL, {extraHeaders: {
    'ngrok-skip-browser-warning': 10,
  }});

const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;