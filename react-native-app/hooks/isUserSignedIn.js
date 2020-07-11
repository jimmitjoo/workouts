import * as React from 'react';
import * as SecureStore from "expo-secure-store";

export default function isUserSignedIn() {
  const [isSignedIn, setUserSignedIn] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {

    async function checkIfUserIsSignedInAsync() {
      await SecureStore.getItemAsync('UserId').then(data => {
        if (data !== null) {
          setUserSignedIn(true);
        } else {
          setUserSignedIn(false);
        }
      })
    }

    checkIfUserIsSignedInAsync();
  }, []);

  return isSignedIn;
}
