import * as React from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import Layout from "../constants/Layout";

export default function WorkoutsScreen() {

    const [errorMsg, setErrorMsg] = React.useState(null);
    const [queryParams, setQueryParams] = React.useState(null);

    React.useEffect(() => {
        getLocation(setErrorMsg, setQueryParams);
    });

    function renderErrorMessage() {
        let render = null;
        if (errorMsg) {
            render = <Text style={Layout.errorMessage}>{errorMsg}</Text>
        }

        return render
    }

    return (
        <View style={Layout.container}>
            {renderErrorMessage()}
            <FlatList
                data={[
                    { key: 'Devin' },
                    { key: 'Dan' },
                    { key: 'Dominic' },
                    { key: 'Jackson' },
                    { key: 'James' },
                    { key: 'Joel' },
                    { key: 'John' },
                    { key: 'Jillian' },
                    { key: 'Jimmy' },
                    { key: 'Julie' },
                    { key: '2Devin' },
                    { key: '2Dan' },
                    { key: '2Dominic' },
                    { key: '2Jackson' },
                    { key: 'J2ames' },
                    { key: '2Joel' },
                    { key: '2John' },
                    { key: '2Jillian' },
                    { key: '2Jimmy' },
                    { key: '2Julie' },
                ]}
                renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
            />
            <Text>{queryParams}</Text>
        </View>
    );
}

async function getLocation(setErrorMsg, setQueryParams) {
    let { status } = await Location.requestPermissionsAsync();

    if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync({});

    let latitude = JSON.stringify(location.coords.latitude).substring(0,8);
    let longitude = JSON.stringify(location.coords.longitude).substr(0,8);

    setQueryParams('?lat=' + latitude + '&lng=' + longitude)
}

const styles = StyleSheet.create({
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});