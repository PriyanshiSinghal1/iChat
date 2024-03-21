const socket=io();

const form=document.getElementById('send-container');
const messageInput=document.getElementById('messageInp');
const messageContainer=document.querySelector('.container');
var audio=new Audio('ting.mp3');


const Name=prompt("Enter your name to join the chat");
socket.emit('new-user-joined',Name);

const append=(message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left'){
        audio.play();
    }
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageInput.value;
    append(`You: ${message}`, 'right')
    socket.emit('send',message);
    // console.log('Sending message:',message);
    messageInput.value=''
})


// Event handler for user joining notification
socket.on('user-joined', (Name) => {
    append(`${Name} joined the chat`, 'right');
});

//Event handler for receiving messages
socket.on('receive', data => {
    append(`${data.Name}: ${data.message}`, 'left');
});

socket.on('left',Name=>{
    append(`${Name}: left the chat`, 'left')
});