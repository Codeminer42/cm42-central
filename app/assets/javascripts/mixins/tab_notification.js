
var TabNotification = module.exports = {
  changeTitle: function(title, documentStatus) {
    var notificationTitle = ' \u2733 ' + title;

    if (documentStatus) {
      this.handleChangeTitle(notificationTitle, '/assets/notification.ico');
    } else {
      this.handleChangeTitle(title, '/assets/favicon.ico');
    }
  },

  handleChangeTitle: function(title, href) {
    var favicon = $('link[rel="shortcut icon"]');
    favicon.prop('href', href);
    document.title = title;
  }
};
