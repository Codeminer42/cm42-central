const TabNotification = {
  changeTitle: function (title, documentStatus) {
    var notificationTitle = ' \u2733 ' + title;

    if (documentStatus) {
      this.handleChangeTitle(
        notificationTitle,
        $('body').data('notificationIconUrl')
      );
    } else {
      this.handleChangeTitle(title, $('body').data('faviconIconUrl'));
    }
  },

  handleChangeTitle: function (title, href) {
    var favicon = $('link[rel="shortcut icon"]');
    favicon.prop('href', href);
    document.title = title;
  },
};

export default TabNotification;
