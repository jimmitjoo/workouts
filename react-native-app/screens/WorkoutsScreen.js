import * as React from 'react';
import {Button, FlatList, StyleSheet, Text, View} from 'react-native';
import * as Location from 'expo-location';
import Layout from "../constants/Layout";
import Planning from "../components/Workouts/Planning";
import {StateContext} from "../globalState";
import {FetchWorkouts} from "../backend/Api";

export default class WorkoutsScreen extends React.Component {

    _isMounted = false;

    static contextType = StateContext;

    constructor(props) {
        super(props);

        this.props = props

        this.state = {
            errorMsg: null,

            latitude: null,
            longitude: null,
            workouts: [],
            showCreateWorkout: false,
        };
    }

    componentDidMount() {

        this._isMounted = true;

        let untilDate = new Date();
        untilDate.setDate(untilDate.getDate() + 3);

        this.getLocation().then(() => {
            FetchWorkouts(this.state.latitude,
                this.state.longitude,
                this.formatDate(new Date()),
                this.formatDate(untilDate)).then(response => {
                console.log({FetchWorkouts: response})
                if (response.workouts) {
                    console.log('lets set state')
                    this.setState({workouts: response.workouts})
                }
            })


        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleWorkoutPlanned() {
        this.setState({showCreateWorkout: false})
    }

    formatDate(d) {
        let month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-')
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
                latitude: latitude,
                longitude: longitude,
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
                <Planning doneHandler={this.handleWorkoutPlanned.bind(this)} navigation={this.props.navigation}/>
                <Button onPress={() => this.setState({showCreateWorkout: false})} title={"Cancel"}/>
            </View>
        }
    }

    renderWorkoutList() {
        const [{currentUserKey}, dispatch] = this.context;

        if (!this.state.showCreateWorkout || currentUserKey === null) {
            return <View style={Layout.container}>
                <FlatList
                    data={this.state.workouts}
                    renderItem={({item}) => <Text style={styles.item}>{item.activity}: {item.name}</Text>}
                    keyExtractor={(item, index) => index.toString()}
                />
                <Text>{this.state.latitude} {this.state.longitude}</Text>
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