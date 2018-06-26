import {keystore} from 'eth-lightwallet'

/**        addresses: keys.addresses,
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
/*
export function test(password) {
  let seedPhrase = keystore.generateRandomSeed()
  console.log('seed', seedPhrase)
  keystore.createVault({
    password: password,
    seedPhrase: seedPhrase,
    hdPathString: "m/0'/0'/0'"
  }, function (err, ks) {
    if (err) throw err
    // Some methods will require providing the `pwDerivedKey`,
    // Allowing you to only decrypt private keys on an as-needed basis.
    // You can generate that value with this convenient method:
    ks.keyFromPassword(password, function (err, pwDerivedKey) {
      if (err) throw err;
      console.log('pwDerivedKey',pwDerivedKey)
      // generate five new address/private key pairs
      // the corresponding private keys are also encrypted
      ks.generateNewAddress(pwDerivedKey, 1);
      var addr = ks.getAddresses();
      console.log('addr', addr)
      let serializedKeystore = ks.serialize()
      ks.passwordProvider = function (callback) {
        var pw = prompt("Please enter password", "Password");
        console.log('pw', pw)
        callback(null, pw);
      };

      // Now set ks as transaction_signer in the hooked web3 provider
      // and you can start using web3 using the keys/addresses in ks!
    });
  });
}
*/
