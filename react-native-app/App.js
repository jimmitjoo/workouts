import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';

import useCachedResources from './hooks/useCachedResources';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import { StateProvider } from "./globalState";
import SingleWorkoutScreen from "./screens/SingleWorkoutScreen";

const Stack = createStackNavigator();

export default function App(props) {

    const initialState = {
        user: {},
        currentUserKey: null,
    };

    const reducer = (state, action) => {
        switch (action.type) {
            case 'setUserKey':
                return {
                    ...state,
                    currentUserKey: action.currentUserKey
                };
            case 'updateUser':
                return {
                    ...state,
                    user: action.user
                }
            default:
                return state;
        }
    };

    const isLoadingComplete = useCachedResources();

    if (!isLoadingComplete) {
        return null;
    } else {

        return (
            <View style={styles.container}>
                {Platform.OS === 'ios' && <StatusBar barStyle="dark-content"/>}
                <StateProvider initialState={initialState} reducer={reducer}>
                    <NavigationContainer linking={LinkingConfiguration}>
                        <Stack.Navigator>
                            <Stack.Screen name="Root" component={BottomTabNavigator}/>
                            <Stack.Screen name="SingleWorkout" component={SingleWorkoutScreen}/>
                        </Stack.Navigator>
                    </NavigationContainer>
                </StateProvider>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
