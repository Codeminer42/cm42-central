import Pusher from 'pusher-js';

const pusherArgsRegex = /\/\/ws-(.*)\.pusher.*\/(.*)$/;

const pusherUrl = process.env.PUSHER_SOCKET_URL;

const [
  _, // whole match
  pusherCluster,
  pusherApiKey
] = pusherUrl.match(pusherArgsRegex);

export const subscribeToProjectChanges = (project, callback) => {
  const socket = getProjectSocket();

  if(!socket) {
    return;
  }

  const channel = socket.subscribe('project-board-' + project.id);

  channel.bind('notify_changes', callback);
};

let projectSocket;

const getProjectSocket = () => {
  if(!projectSocket) {
    try {
      projectSocket = new Pusher(pusherApiKey, {
        cluster: pusherCluster,
        encrypted: true
      });
    } catch(error) {
      console.error(error);
      return;
    }
  }

  return projectSocket;
}
