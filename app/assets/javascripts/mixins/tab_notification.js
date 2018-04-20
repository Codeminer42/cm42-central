/* eslint no-unused-vars:"off" */
/* eslint no-multi-assign:"off" */
const TabNotification = module.exports = {
  changeTitle(title, documentStatus) {
    const notificationTitle = ` \u2733 ${title}`;

    if (documentStatus) {
      this.handleChangeTitle(notificationTitle, '/assets/notification.ico');
    } else {
      this.handleChangeTitle(title, '/assets/favicon.ico');
    }
  },

  handleChangeTitle(title, href) {
    const favicon = $('link[rel="shortcut icon"]');
    favicon.prop('href', href);
    document.title = title;
  },
};
