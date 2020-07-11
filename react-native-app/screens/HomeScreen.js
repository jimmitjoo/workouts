import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import AppLogo from "../components/AppLogo";
import Layout from "../constants/Layout";

export default function HomeScreen({navigation}) {

    return (
        <View style={Layout.container}>
            <ScrollView style={Layout.container} contentContainerStyle={Layout.contentContainer}>
                <AppLogo/>

                <View style={styles.getStartedContainer}>

                    <Text style={styles.getStartedText}>
                        We believe in social exercise for a healthier world.
                    </Text>

                    <Text style={styles.getStartedText}>
                        Sign in to connect, or sneak around a bit.
                    </Text>
                </View>

                <View style={styles.buttonsContainer}>
                    <Button title={"Sign In"} onPress={() => navigation.navigate('SignIn')}/>
                    <Button title={"Create Account"} onPress={() => navigation.navigate('SignUp')}/>
                    <Button title={"Peek Without Account"} onPress={() => navigation.navigate('Workouts')}/>
                </View>

                <View style={Layout.helpLinkContainer}>
                    <Text onPress={handleLearnMorePress} style={Layout.helpLinkText}>Why should I have an
                        account?</Text>
                </View>
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
