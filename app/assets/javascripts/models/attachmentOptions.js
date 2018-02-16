const REFRESH_TIME = 3600001;

export default class AttachmentOptions {
  constructor({ refreshCallback }) {
    this.refreshCallback = refreshCallback;
  }

  fetch() {
    return this.fetchOptions().then((response) => {
      this.refreshCallback(response);
      this.timestampVerifierId = this.initExpirationVerifier();
      return response;
    })
  }

  clear() {
    clearTimeout(this.timestampVerifierId);
  }

  fetchOptions() {
    const requestOptions = {
      type: 'GET',
      dataType: 'json',
      url: '/attachments/signature'
    }
    return $.ajax(requestOptions)
  }

  initExpirationVerifier() {
    return setTimeout(() => {
      this.fetch();
    }, REFRESH_TIME);
  }
}
