import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as React from 'react';

import HomeScreen from '../screens/HomeScreen';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import AntDesignIcon from "../components/AntDesignIcon";
import {useStateValue} from "../globalState";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({navigation, route}) {
    // Set the header title on the parent stack navigator depending on the
    // currently active tab. Learn more in the documentation:
    // https://reactnavigation.org/docs/en/screen-options-resolution.html
    navigation.setOptions({headerTitle: getHeaderTitle(route)});

    const [{currentUserKey}, dispatch] = useStateValue();

    function renderSignUp() {
        if (currentUserKey === null) {

            return <BottomTab.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{
                    title: 'Sign Up',
                    tabBarIcon: ({focused}) => <AntDesignIcon focused={focused} name="adduser"/>,
                }}
            />
        }

        return null;
    }

    function renderSignIn() {
        if (currentUserKey === null) {
            return <BottomTab.Screen
                name="SignIn"
                component={SignInScreen}
                options={{
                    title: 'Sign In',
                    tabBarIcon: ({focused}) => <AntDesignIcon focused={focused} name="login"/>,
                }}
            />
        }

        return null;
    }

    return (
        <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
            <BottomTab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Get Started',
                    tabBarIcon: ({focused}) => <AntDesignIcon focused={focused} name="smileo"/>,
                }}
            />

            {renderSignIn()}
            {renderSignUp()}

            <BottomTab.Screen
                name="Workouts"
                component={WorkoutsScreen}
                options={{
                    title: 'Workouts',
                    tabBarIcon: ({focused}) => <AntDesignIcon focused={focused} name="enviromento"/>,
                }}
            />
        </BottomTab.Navigator>
    );
}

function getHeaderTitle(route) {
    const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

    switch (routeName) {
        case 'Home':
            return 'Get started, no time to waste!';
        case 'SignIn':
            return 'Sign in to join the community';
        case 'SignUp':
            return 'Sign up to join the community';
        case 'Links':
            return 'Links to learn more';
        case 'Workouts':
            return 'Where\'s the Workout?!';
        case 'SingleWorkout':
            return 'Workout';
    }
}
