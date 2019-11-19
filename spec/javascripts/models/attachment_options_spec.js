import AttachmentOptions from 'models/attachmentOptions';

describe("AttachmentOptions", function() {
  let refreshCallback;
  let attachinaryJSON = {
    "attachinary": {
      "accessible": true,
      "accept": ["raw", "jpg", "png", "psd", "docx", "xlsx", "doc", "xls"],
      "maximum": 10,
      "single": false,
      "scope": "documents",
      "plural": "documents",
      "singular": "document",
      "files": []
    },
    "cloudinary": {
      "tags": ["development_env", "attachinary_tmp"],
      "use_filename": true
    },
    "html": {
      "class": ["attachinary-input"],
      "accept": "image/jpeg,image/png,image/vnd.adobe.photoshop,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/excel",
      "multiple": true,
      "data": {
        "attachinary": {
          "accessible": true,
          "accept": ["raw", "jpg", "png", "psd", "docx", "xlsx", "doc", "xls"],
          "maximum": 10,
          "single": false,
          "scope": "documents",
          "plural": "documents",
          "singular": "document",
          "files": []
        },
        "form_data": {
          "timestamp": 1435347909,
          "callback": "http://localhost:3000/attachinary/cors",
          "tags": "development_env,attachinary_tmp",
          "signature": "db3b029ed02431b1dccac45cc8b2159a280fd334",
          "api_key": "893592954749395"
        },
        "url": "https://api.cloudinary.com/v1_1/hq5e5afno/auto/upload"
      }
    }
  }
  let server;

  beforeEach(function(done) {
    refreshCallback = sinon.spy();

    let attachmentOptions = new AttachmentOptions({ refreshCallback });

    server = sinon.fakeServer.create();

    server.respondWith(
      "GET", "/attachments/signature", [
        200, {"Content-Type": "application/json"},
        JSON.stringify(attachinaryJSON)
      ]
    );

    attachmentOptions.fetch().then(() => {
      done();
    });

    server.respond();
  });

  afterEach(function() {
    server.restore();
  });

  it("fetch return a signature", function() {
    expect(refreshCallback).toHaveBeenCalledWith(attachinaryJSON);
  });
});
