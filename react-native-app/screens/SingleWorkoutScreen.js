import * as React from "react";
import {Text, View, Button} from "react-native"
import MapView, {Marker} from 'react-native-maps'
import Layout from "../constants/Layout";

export default class SingleWorkoutScreen extends React.Component {

    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = JSON.parse(props.route.params.workout)
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    renderActionButtons() {
        if (this.state.joined && !this.state.creator) {
            return <Button title={"Leave"}/>
        }
        if (!this.state.joined) {
            return <Button title={"Join"}/>
        }
        if (this.state.creator) {
            return <Button title={"Cancel Workout"}/>
        }
    }

    render() {
        let datetime = new Date(this.state.date);

        let today = new Date();

        let date = null;
        if (datetime.toDateString() !== today.toDateString()) {
            date = datetime.toLocaleDateString()
        } else {
            date = 'Today at'
        }

        return <View>
            <MapView style={{height: 300}} initialRegion={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}>
                <Marker coordinate={{latitude: this.state.latitude, longitude: this.state.longitude}}/>
            </MapView>
            <View style={Layout.textContentContainer}>
                <Text>{this.state.id}</Text>
                <Text style={{fontSize: 24}}>{this.state.name}</Text>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>{this.state.activity}</Text>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>{date} {datetime.toLocaleTimeString()}</Text>
                <Text style={{fontSize: 16}}>{this.state.description}</Text>
            </View>
            {this.renderActionButtons()}
        </View>
    }
}