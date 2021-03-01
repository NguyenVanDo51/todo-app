import axios from 'axios';

const FileDownload = require('js-file-download');

export function Download(url, filename) {
  return axios(url, {
                  method: 'get',
                  responseType: 'blob',
                  }).then((response) => {
                    FileDownload(response.data, filename);
                  }).catch((err) => err);
}