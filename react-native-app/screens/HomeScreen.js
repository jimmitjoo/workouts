import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import AppLogo from "../components/AppLogo";
import Layout from "../constants/Layout";
import {useStateValue} from "../globalState";
import * as SecureStore from "expo-secure-store";
import {SignOut} from "../backend/Api";

export default function HomeScreen({navigation}) {

    const [{currentUserKey, user}, dispatch] = useStateValue();

    console.log(user)
    console.log(currentUserKey)

    SecureStore.getItemAsync('signInKey').then(signInKey => {
        if (signInKey === null) {
            dispatch({
                type: 'setUserKey',
                currentUserKey: null,
            });
        } else if (signInKey !== "") {
            dispatch({
                type: 'setUserKey',
                currentUserKey: signInKey,
            });
            getUser();
        }
    });

    function getUser() {
        SecureStore.getItemAsync('user').then(userData => {
            if (userData !== null) {
                dispatch({
                    type: 'updateUser',
                    user: {
                        email: userData.email,
                        firstname: userData.firstname,
                        lastname: userData.lastname,
                    },
                });
            }
        })
    }

    function signOutUser() {
        SignOut();
        dispatch({
            type: 'updateUser',
            user: {},
        });
    }

    function renderSignedOutButtons() {
        if (currentUserKey) return <View style={styles.buttonsContainer}>
            <Button title={"Sign Out"} onPress={() => signOutUser()}/>
        </View>;

        return <View>
            <View style={styles.buttonsContainer}>
                <Button title={"Sign In"} onPress={() => navigation.navigate('SignIn')}/>
                <Button title={"Create Account"} onPress={() => navigation.navigate('SignUp')}/>
                <Button title={"Peek Without Account"} onPress={() => navigation.navigate('Workouts')}/>
            </View>

            <View style={Layout.helpLinkContainer}>
                <Text onPress={handleLearnMorePress} style={Layout.helpLinkText}>Why should I have an
                    account?</Text>
            </View>
        </View>
    }

    function renderEmail() {
        if (user && user.email) {
            return <Text>{user.email}</Text>
        }
    }

    function renderTextDepedningOnUserStatus() {

        if (currentUserKey) {
            return <View style={styles.getStartedContainer}>

                <Text>{currentUserKey}</Text>

                {renderEmail()}

                <Text style={styles.getStartedText}>
                    We believe in social exercise for a healthier world.
                </Text>
            </View>;
        }

        return <View style={styles.getStartedContainer}>

            <Text style={styles.getStartedText}>
                We believe in social exercise for a healthier world.
            </Text>

            <Text style={styles.getStartedText}>
                Sign in to connect, or sneak around a bit.
            </Text>
        </View>;

    }

    return (


        <View style={Layout.container}>
            <ScrollView style={Layout.container} contentContainerStyle={Layout.contentContainer}>
                <AppLogo/>

                {renderTextDepedningOnUserStatus()}

                {renderSignedOutButtons()}
            </ScrollView>

        </View>

    )
}

HomeScreen.navigationOptions = {
    header: null,
};

function handleLearnMorePress() {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/workflow/development-mode/');
}

const styles = StyleSheet.create({
    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
    },
    getStartedText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        lineHeight: 24,
        textAlign: 'center',
        paddingTop: 12,
    },
    buttonsContainer: {
        alignItems: 'center',
        marginTop: 50,
    }
});
