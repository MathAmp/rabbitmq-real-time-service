import clientSocket from 'socket.io-client';

export const API_URL = "http://batatas.iptime.org:5555";
const socket = clientSocket(`${API_URL}/calc`);

export const subscribe = (newCallback) => {
  socket.on("calc", (result) => {
    result = JSON.parse(result);
    newCallback(result);
  });
}

