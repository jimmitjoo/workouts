import * as React from 'react';
import {Button, FlatList, StyleSheet, Text, View} from 'react-native';
import * as Location from 'expo-location';
import Layout from "../constants/Layout";
import WorkoutPlanning from "../components/Workouts/WorkoutPlanning";
import {StateContext} from "../globalState";

export default class WorkoutsScreen extends React.Component {

    _isMounted = false;

    static contextType = StateContext;

    constructor(props) {
        super(props);

        this.state = {
            errorMsg: null,
            queryParams: null,

            showCreateWorkout: false,
        };
    }

    componentDidMount() {

        this._isMounted = true;

        this.getLocation();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async getLocation() {
        let {status} = await Location.requestPermissionsAsync();

        if (status !== 'granted' && this._isMounted) {
            this.setState({
                errorMsg: 'Permission to access location was denied'
            });
        }

        let location = await Location.getCurrentPositionAsync({});

        let latitude = JSON.stringify(location.coords.latitude).substring(0, 8);
        let longitude = JSON.stringify(location.coords.longitude).substr(0, 8);

        if (this._isMounted) {
            this.setState({
                queryParams: '?lat=' + latitude + '&lng=' + longitude
            })
        }
    }

    renderErrorMessage() {
        let render = null;
        if (this.state.errorMsg) {
            render = <Text style={Layout.errorMessage}>{this.state.errorMsg}</Text>
        }

        return render
    }

    renderCreateWorkoutButton() {
        const [{currentUserKey}, dispatch] = this.context;

        if (!this.state.showCreateWorkout && currentUserKey) {
            return <Button onPress={() => this.setState({showCreateWorkout: true})} title={"Schedule Workout"}/>
        }
    }

    renderWorkoutPlanning() {
        const [{currentUserKey}, dispatch] = this.context;

        if (this.state.showCreateWorkout && currentUserKey) {
            return <View>
                <WorkoutPlanning/>
                <Button onPress={() => this.setState({showCreateWorkout: false})} title={"Cancel"}/>
            </View>
        }
    }

    renderWorkoutList() {
        const [{currentUserKey}, dispatch] = this.context;

        if (!this.state.showCreateWorkout || currentUserKey === null) {
            return <View style={Layout.container}>
                <FlatList
                    data={[
                        {key: 'Devin'},
                        {key: 'Dan'},
                        {key: 'Dominic'},
                        {key: 'Jackson'},
                        {key: 'James'},
                        {key: 'Joel'},
                        {key: 'John'},
                        {key: 'Jillian'},
                        {key: 'Jimmy'},
                        {key: 'Julie'},
                        {key: '2Devin'},
                        {key: '2Dan'},
                        {key: '2Dominic'},
                        {key: '2Jackson'},
                        {key: 'J2ames'},
                        {key: '2Joel'},
                        {key: '2John'},
                        {key: '2Jillian'},
                        {key: '2Jimmy'},
                        {key: '2Julie'},
                    ]}
                    renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
                />
                <Text>{this.state.queryParams}</Text>
            </View>
        }
    }

    render() {
        const [{currentUserKey}, dispatch] = this.context;

        if (currentUserKey) {
            return (
                <View style={Layout.container}>
                    {this.renderWorkoutPlanning()}
                    {this.renderErrorMessage()}
                    {this.renderWorkoutList()}
                    {this.renderCreateWorkoutButton()}
                </View>
            );
        }

        return (
            <View style={Layout.container}>
                {this.renderErrorMessage()}
                {this.renderWorkoutList()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});