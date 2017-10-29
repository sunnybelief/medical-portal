import fetch from 'dva/fetch';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if(response.status===401){
    throw new Error('没有权限访问');
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function checkData(data) {
  if (data.successful) {
    return data.object
  }

  const error=new Error(data.object.message===undefined?data.object.status:data.object.message);
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(checkData)
}
