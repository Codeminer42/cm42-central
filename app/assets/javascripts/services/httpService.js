import axios from 'axios';

const httpService = axios.create({
  headers: {
    Accept: 'application/json, text/javascript',
    'X-CSRF-Token': $('[name=csrf-token]').attr('content')
  }
});

export default httpService;
