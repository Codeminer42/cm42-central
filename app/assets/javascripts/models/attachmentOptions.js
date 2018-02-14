const REFRESH_TIME = 3600001;

export default class AttachmentOptions {


  fetch() {
    return this.fetchOptions().then((response) => {
      window.attachinarySignature = response;
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
