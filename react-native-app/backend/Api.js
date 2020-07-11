import * as SecureStore from 'expo-secure-store';

let root = 'https://y9y7etrj87.execute-api.eu-north-1.amazonaws.com/Prod';

let endpoints = {
    signUpPath: root + '/create-account',
    signInPath: root + '/sign-in',
}

export function SignIn(email, password) {

    let responseData = {};

    return fetch(endpoints.signInPath, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password,
        })
    })
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
            if (json.sign_in_key && json.sign_in_key !== "") {
                SecureStore.setItemAsync('signInKey', json.sign_in_key)

                responseData.sign_in_key = json.sign_in_key;
                responseData.success = true;

            } else {
                responseData.error = json.message;
            }

            return responseData;
        })
        .catch((error) => {
            console.log(error);
            responseData.error = error;

            return responseData;
        });
}

/**
 * @return {boolean}
 */
export async function IsSignedIn() {
    let isSignedIn = false;

    await SecureStore.getItemAsync('signInKey').then(signInKey => {
        console.log({'signInKey': signInKey});
        if (signInKey === null) {
            isSignedIn = false;
        } else if (signInKey !== "") {
            isSignedIn = true;
        }
    }).catch(err => {
        console.log(err)
    });

    console.log({'isSignedIn': isSignedIn})

    return isSignedIn;
}

export function SignUp(name, email, password) {

    let responseData = {};

    return fetch(endpoints.signUpPath, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'name': name,
            'email': email,
            'password': password,
        })
    })
        .then((response) => response.json())
        .then((json) => {

            if (parseInt(json.id) > 0) {
                SecureStore.setItemAsync('userId', json.id)

                responseData.success = true;

            } else {
                responseData.error = json.message;
            }

            return responseData;

        })
        .catch((error) => {

            responseData.error = error;

            return responseData;

        });
}

/**
 * @return {boolean}
 */
export async function SignOut() {
    let signedOut = false;
    await SecureStore.deleteItemAsync('signInKey').then(r => signedOut = true);
    return signedOut;
}