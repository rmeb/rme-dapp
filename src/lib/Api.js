//const APIURL = 'http://192.168.0.25:4000'
const APIURL = 'https://rx-keyserver.herokuapp.com'
const RECIPE_API = 'https://servidor-rme-sandbox.herokuapp.com'
const FARMA_API = 'https://servidor-farmacos-sandbox.herokuapp.com'
const ORACLE_API = 'https://restringidos-oracle.herokuapp.com'

export function isRestricted(codigo) {
  return fetch(ORACLE_API + '/consultar', {
    method: 'POST',
    body: JSON.stringify({codigo}),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response).then(success)
}

export function getFarmaco(codigo) {
  return fetch(FARMA_API + '/farmaco/' + codigo, {
    method: 'GET'
  }).then(response).then(success)
}

export function getRecetaXml(identifier) {
  return fetch(RECIPE_API + '/receta/' + identifier, {
    method: 'GET'
  }).then(response).then(success)
}

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
