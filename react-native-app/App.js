import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';

import WorkoutsScreen from "./screens/WorkoutsScreen";
import useCachedResources from './hooks/useCachedResources';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import checkUserStatus from "./hooks/isUserSignedIn";

const Stack = createStackNavigator();

export default function App(props) {

    const isUserSignedIn = checkUserStatus();
    const isLoadingComplete = useCachedResources();

    if (!isLoadingComplete) {
        return null;
    } else if (!isUserSignedIn) {

        return (
            <View style={styles.container}>
                {Platform.OS === 'ios' && <StatusBar barStyle="dark-content"/>}
                <NavigationContainer linking={LinkingConfiguration}>
                    <Stack.Navigator>
                        <Stack.Screen name="Root" component={BottomTabNavigator}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </View>
        );
    } else {
        return <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="dark-content"/>}
            <NavigationContainer linking={LinkingConfiguration}>
                <WorkoutsScreen/>
            </NavigationContainer>
        </View>
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
