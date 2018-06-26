const EMAIL_REG = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;

export function validateEmail(email) {
  return EMAIL_REG.test(email);
}

export function rut_valid(rut) {
  if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut))
    return false

  let split = rut.toLowerCase().split('-')
  return dv(parseInt(split[0], 10)).toString() === split[1]
}

function dv(R) {
  let M=0
  let S=1;
  for (; R; R = Math.floor(R / 10))
    S = (S + R % 10 * (9 - M++ % 6)) % 11
  return S ? S - 1 : 'k'
}


export default {
  rut: rut_valid,
  numeric: (v) => !isNaN(v),
  email: validateEmail
}
