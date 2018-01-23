const REFRESH_TIME = 3500000;

export default class AttachmentOptions {

  constructor({ refreshCallback }) {
    this.refreshCallback = refreshCallback;
  }

  fetch() {
    return this.fetchOptions().then((response) => {
      this.refreshCallback(response);
      this.timestampVerifierId = this.initExpirationVerifier();
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
    setTimeout(() => {
      this.fetch();
    }, REFRESH_TIME);
  }
}
