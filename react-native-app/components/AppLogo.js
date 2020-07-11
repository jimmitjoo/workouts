import {Image, View, StyleSheet} from "react-native";
import * as React from "react";

export default function AppLogo() {
    return <View style={styles.welcomeContainer}>
        <Image
            source={
                __DEV__
                    ? require('../assets/images/MateRun.png')
                    : require('../assets/images/robot-prod.png')
            }
            style={styles.welcomeImage}
        />
    </View>;
}

const styles = StyleSheet.create({
    welcomeContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    welcomeImage: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
    },
});