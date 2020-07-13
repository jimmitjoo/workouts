import * as SecureStore from 'expo-secure-store';

let root = 'https://y9y7etrj87.execute-api.eu-north-1.amazonaws.com/Prod';

let endpoints = {
    signUp: root + '/create-account',
    signIn: root + '/sign-in',
    workout: root + '/workouts',
    listWorkouts: root + '/list-workouts'
};

export function SignIn(email, password) {

    let responseData = {};

    return fetch(endpoints.signIn, {
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

                responseData.email = json.email;
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

    return fetch(endpoints.signUp, {
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
    await SecureStore.deleteItemAsync('user').then(r => signedOut = true);
    return signedOut;
}

export function FetchWorkouts(latitude, longitude, todayDate, untilDate) {
    let responseData = {};

    return fetch(endpoints.listWorkouts, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            latitude: latitude,
            longitude: longitude,
            today_date: todayDate,
            until_date: untilDate,
        })
    })
        .then((response) => response.json())
        .then((json) => {
            return json
        })
        .catch((error) => {
            responseData.error = error;

            return responseData;
        });

}

export function CreateWorkout(starting_at, activity, name, description, latitude, longitude, action_key) {
    let responseData = {};

    return fetch(endpoints.workout, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            activity: activity,
            latitude: latitude,
            longitude: longitude,
            action_key: action_key,
            description: description,
            starting_at: starting_at,
        })
    })
        .then((response) => response.json())
        .then((json) => {
            return json
        })
        .catch((error) => {
            responseData.error = error;

            return responseData;
        });
}