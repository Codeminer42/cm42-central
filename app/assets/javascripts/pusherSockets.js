import Pusher from 'pusher-js';

const pusherApiKey = process.env.PUSHER_APP_KEY;
const pusherCluster = process.env.PUSHER_APP_CLUSTER;

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
