import Pusher from 'pusher-js';

const matchPusherUrl = url => {
  const pusherArgsRegex = /\/\/ws-(.*)\.pusher.*\/(.*)$/;
  return url.match(pusherArgsRegex);
};

export const subscribeToProjectChanges = (project, callback) => {
  const pusherUrl = import.meta.env.VITE_PUSHER_SOCKET_URL || '';
  const [_, pusherCluster, pusherApiKey] = matchPusherUrl(pusherUrl) || [];

  if (!pusherApiKey || !pusherCluster) {
    setInterval(callback, 10 * 1000); // every 10 seconds
    return;
  }

  const socket = getProjectSocket(pusherApiKey, pusherCluster);

  if (!socket) {
    return;
  }

  const channel = socket.subscribe('project-board-' + project.id);

  channel.bind('notify_changes', callback);
};

const getProjectSocket = (apiKey, apiCluster) => {
  try {
    return window._railsEnv === 'production'
      ? new Pusher(apiKey, {
          cluster: apiCluster,
          encrypted: true,
        })
      : new Pusher(apiKey, {
          cluster: apiCluster,
          wsHost: import.meta.env.VITE_PUSHER_WS_HOST,
          wsPort: import.meta.env.VITE_PUSHER_WS_PORT,
          encrypted: false,
          disableStats: true,
        });
  } catch (error) {
    console.error(error);
    return;
  }
};
