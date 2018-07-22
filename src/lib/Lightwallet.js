import {keystore} from 'eth-lightwallet'

/**
* addresses: keys.addresses,
* Genera una 12-word seed de manera aleatorea y la usa, junto a la contraserña
* para crear un keystore, luego genera una nueva direccion ethereum y retorna
* la 12-word seed junto con la direccion y el keystore serializado.
**/
export function create_keys(password) {
  let seedPhrase = keystore.generateRandomSeed()
  return new Promise((resolve, reject) => {
    keystore.createVault({
      password: password,
      seedPhrase: seedPhrase,
      hdPathString: "m/0'/0'/0'"
    }, function (err, ks) {
      if (err) return reject(err)
      ks.keyFromPassword(password, function (err, pwDerivedKey) {
        if (err) return reject(err);
        ks.generateNewAddress(pwDerivedKey, 1);
        resolve({
          seedPhrase,
          keystore: ks
        })
      });
    });
  })
}

/**
* Deserializa el keystore para utilizarlo.
**/
export function restore_keystore(serializedKeystore) {
  return keystore.deserialize(serializedKeystore)
}
