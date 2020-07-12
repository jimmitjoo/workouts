import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import AppLogo from "../components/AppLogo";
import Layout from "../constants/Layout";
import {StateContext, useStateValue} from "../globalState";
import * as SecureStore from "expo-secure-store";
import {SignOut} from "../backend/Api";

export default class HomeScreen extends React.Component {

    _isMounted = false;

    static contextType = StateContext;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._isMounted = true;

        const [{}, dispatch] = this.context;

        SecureStore.getItemAsync('signInKey').then(signInKey => {
            if (signInKey === null && this._isMounted) {
                dispatch({
                    type: 'setUserKey',
                    currentUserKey: null,
                });
            } else if (signInKey !== "" && this._isMounted) {
                dispatch({
                    type: 'setUserKey',
                    currentUserKey: signInKey,
                });
                this.getUser();
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getUser() {
        const [{}, dispatch] = this.context;

        SecureStore.getItemAsync('user').then(userData => {
            if (userData !== null && this._isMounted) {
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

    signOutUser() {
        const [{}, dispatch] = this.context;

        SignOut();
        dispatch({
            type: 'setUserKey',
            currentUserKey: null,
        });
        dispatch({
            type: 'updateUser',
            user: {},
        });
    }

    renderSignedOutButtons() {
        const [{currentUserKey}, dispatch] = this.context;

        if (currentUserKey) return <View style={styles.buttonsContainer}>
            <Button title={"Sign Out"} onPress={() => this.signOutUser()}/>
        </View>;

        return <View>
            <View style={styles.buttonsContainer}>
                <Button title={"Sign In"} onPress={() => this.props.navigation.navigate('SignIn')}/>
                <Button title={"Create Account"} onPress={() => this.props.navigation.navigate('SignUp')}/>
                <Button title={"Where's the Workout?"} onPress={() => this.props.navigation.navigate('Workouts')}/>
            </View>

            <View style={Layout.helpLinkContainer}>
                <Text onPress={handleLearnMorePress} style={Layout.helpLinkText}>Why should I have an
                    account?</Text>
            </View>
        </View>
    }

    renderEmail() {
        const [{user}, dispatch] = this.context;

        if (user && user.email) {
            return <Text>{user.email}</Text>
        }
    }

    renderTextDepedningOnUserStatus() {

        const [{currentUserKey}, dispatch] = this.context;

        if (currentUserKey) {
            return <View style={styles.getStartedContainer}>

                <Text>{currentUserKey}</Text>

                {this.renderEmail()}

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

    render() {
    return (
        <View style={Layout.container}>
            <ScrollView style={Layout.container} contentContainerStyle={Layout.contentContainer}>
                <AppLogo/>

                {this.renderTextDepedningOnUserStatus()}

                {this.renderSignedOutButtons()}
            </ScrollView>

        </View>
    )
    }
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
