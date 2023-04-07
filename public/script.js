
const socket = io();

const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

let peer = new Peer(Math.floor(Math.random() * 9), {
    path: '/peerjs',
    host: '/',
    port: '3000',
    key: 'unique'
});


let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        });
        
    });

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    });
});

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
});



const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
}


const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    }); 
    videoGrid.append(video);
}
