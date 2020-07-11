import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import LinksScreen from "../screens/LinksScreen";
import FontAwesomeIcon from "../components/FontAwesomeIcon";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import AntDesignIcon from "../components/AntDesignIcon";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({navigation, route}) {
    // Set the header title on the parent stack navigator depending on the
    // currently active tab. Learn more in the documentation:
    // https://reactnavigation.org/docs/en/screen-options-resolution.html
    navigation.setOptions({headerTitle: getHeaderTitle(route)});

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
            <BottomTab.Screen
                name="SignIn"
                component={SignInScreen}
                options={{
                    title: 'Sign In',
                    tabBarIcon: ({focused}) => <AntDesignIcon focused={focused} name="login"/>,
                }}
            />
            <BottomTab.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{
                    title: 'Sign Up',
                    tabBarIcon: ({focused}) => <AntDesignIcon focused={focused} name="adduser"/>,
                }}
            />

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
            return 'Find workouts to join!';
    }
}
