//const APIURL = 'http://192.168.0.25:4000'
const APIURL = 'https://rx-keyserver.herokuapp.com'

export function save_keystore(rut, body) {
  return send('/keystore/' + rut, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}

export function get_keystore(rut, token) {
  return send('/keystore/' + rut, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
}

export function refund(address) {
  return send('/refund/' + address, {
    method: 'GET'
  })
}

function send(path, options) {
  return fetch(APIURL + path, options).then(response).then(success)
}

function response(response) {
  let status = response.status
  if (status === 200 || status === 400 || status === 500) {
    return response.json()
  }
  return Promise.reject(response.statusText)
}

function success(response) {
  return response.status === 'success' ? response.data : Promise.reject(response.data)
}

/*
//FIXME comentar dummy fetch
function fetch(path, data) {
  console.log(path, data)
  return new Promise((resolve, reject) => {
    if (data.method === "POST")  {
      window.localStorage.setItem('rx-db-tmp', data.body)
      resolve({
        status: 200,
        json: () => ({
          status: 'success',
          data: 'created'
        })
      })
    } else {
      resolve({
        status: 200,
        json: function() {
          let obj = JSON.parse(window.localStorage.getItem('rx-db-tmp'))
          return {
            status: 'success',
            data: obj.keystore
          }
        }
      })
    }
  })
}
*/
