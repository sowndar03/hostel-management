const express = require('express')
const app = express();

require('dotenv').config()
let io;
const onlineAdmins = {};
const onlineUsers = {};

function initSocket(server) {
    const { Server } = require('socket.io');
    io = new Server(server, {
        cors: {
            origin: process.env.ALLOWED_ORIGINS?.split(",") || [],
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        socket.on('join-admin-room', (adminId) => {
            socket.join('admins');
            onlineAdmins[adminId] = socket.id;
        });

        socket.on('join-user-room', (userId) => {
            socket.join('users');
            onlineUsers[userId] = socket.id;
        });

        socket.on('disconnect', () => {
            for (const id in onlineAdmins) if (onlineAdmins[id] === socket.id) delete onlineAdmins[id];
            for (const id in onlineUsers) if (onlineUsers[id] === socket.id) delete onlineUsers[id];
        });
    });

    return io;
}

function getIo() {
    if (!io) throw new Error("Socket.io not initialized yet");
    return io;
}

module.exports = { initSocket, getIo, onlineAdmins, onlineUsers };

