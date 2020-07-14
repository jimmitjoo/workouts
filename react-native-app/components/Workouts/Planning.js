import * as React from 'react';
import {Button, Dimensions, Picker, Text, TextInput, View} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, {Marker} from 'react-native-maps'
import Layout from "../../constants/Layout";
import {StateContext} from "../../globalState";
import {CreateWorkout} from "../../backend/Api";
import AntDesignIcon from "../AntDesignIcon";

export default class Planning extends React.Component {

    _isMounted = false;

    static contextType = StateContext;

    constructor(props) {
        super(props);

        let currentTime = new Date();
        let fiveYearsFromNow = new Date();
        fiveYearsFromNow = fiveYearsFromNow.setFullYear(fiveYearsFromNow.getFullYear() + 5);

        this.state = {
            showDateSelector: true,
            showDatePicker: false,
            date: currentTime,
            minDate: currentTime,
            maxDate: fiveYearsFromNow,
            mode: 'date',

            showActivityPicker: false,
            activity: 'Run',

            showLocationPicker: false,
            latitude: 56.655,
            longitude: 16.324,

            showNamingForm: false,
            name: '',
            description: '',

            posted: false
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onDateChange = (event, date) => {
        if (this._isMounted) {
            this.setState({
                date: date
            })
        }
    };

    renderDatePicker() {
        if (this.state.showDateSelector) {
            let toggleButton = null;
            if (this.state.mode === "date") {
                toggleButton = <Button title={"Choose Time"} onPress={() => this.setState({mode: "time"})}/>
            } else if (this.state.mode === "time") {
                toggleButton = <Button title={"Choose Date"} onPress={() => this.setState({mode: "date"})}/>
            }

            function whenText() {
                return <Text style={Layout.text}>When do you plan to exercise?</Text>
            }

            if (this.state.showDatePicker) {
                return <View style={{height: '100%'}}>
                    {whenText()}
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={this.state.date}
                        mode={this.state.mode}
                        is24Hour={true}
                        display="default"
                        onChange={this.onDateChange}
                        minimumDate={this.state.minDate}
                        maximumDate={this.state.maxDate}
                    />
                    {toggleButton}
                    <Button title={"Done"} onPress={() => this.setState({showDatePicker: false})}/>
                </View>
            } else {
                return <View>
                    {whenText()}
                    <Button
                        title={this.state.date.toLocaleDateString() + ' ' + this.state.date.toLocaleTimeString().replace(/(.*)\D\d+/, '$1')}
                        onPress={() => this.setState({showDatePicker: true})}/>
                    <Button onPress={() => {
                        this.setState({
                            showDateSelector: false,
                            showActivityPicker: true,
                        })
                    }} title={"Next"}/>
                </View>
            }
        }
    }

    renderActivityPicker() {
        if (this.state.showActivityPicker) {
            return <View style={{...Layout.contentContainer, height: '100%'}}>
                <Text style={Layout.text}>What sort of activity are you going to do?</Text>
                <Picker
                    selectedValue={this.state.activity}
                    onValueChange={(itemValue, itemIndex) => this.setState({activity: itemValue})}
                >
                    <Picker.Item label="Swim" value="Swim"/>
                    <Picker.Item label="Ride" value="Ride"/>
                    <Picker.Item label="Run" value="Run"/>
                    <Picker.Item label="Hike" value="Hike"/>
                    <Picker.Item label="Walk" value="Walk"/>
                    <Picker.Item label="Alpine Ski" value="Alpine Ski"/>
                    <Picker.Item label="Backcountry Ski" value="Backcountry Ski"/>
                    <Picker.Item label="Canoe" value="Canoe"/>
                    <Picker.Item label="Crossfit" value="Crossfit"/>
                    <Picker.Item label="E-Bike Ride" value="E-Bike Ride"/>
                    <Picker.Item label="Elliptical" value="Elliptical"/>
                    <Picker.Item label="Handcycle" value="Handcycle"/>
                    <Picker.Item label="Ice Skate" value="Ice Skate"/>
                    <Picker.Item label="Inline Skate" value="Inline Skate"/>
                    <Picker.Item label="Kayaking" value="Kayaking"/>
                    <Picker.Item label="Kitesurf" value="Kitesurf"/>
                    <Picker.Item label="Nordic Ski" value="Nordic Ski"/>
                    <Picker.Item label="Rock Climb" value="Rock Climb"/>
                    <Picker.Item label="Roller Ski" value="Roller Ski"/>
                    <Picker.Item label="Rowing" value="Rowing"/>
                    <Picker.Item label="Snowboard" value="Snowboard"/>
                    <Picker.Item label="Snowshow" value="Snowshow"/>
                    <Picker.Item label="Stair-Stepper" value="Stair-Stepper"/>
                    <Picker.Item label="Stand Up Paddling" value="Stand Up Paddling"/>
                    <Picker.Item label="Surfing" value="Surfing"/>
                    <Picker.Item label="Velomobile" value="Velomobile"/>
                    <Picker.Item label="Virtual Ride" value="Virtual Ride"/>
                    <Picker.Item label="Virtual Run" value="Virtual Run"/>
                    <Picker.Item label="Weight Training" value="Weight Training"/>
                    <Picker.Item label="Wheelchair" value="Wheelchair"/>
                    <Picker.Item label="Windsurf" value="Windsurf"/>
                    <Picker.Item label="Workout" value="Workout"/>
                    <Picker.Item label="Yoga" value="Yoga"/>

                </Picker>
                <Button onPress={() => {
                    this.setState({
                        showActivityPicker: false,
                        showLocationPicker: true,
                    })
                }} title={"Next"}/>
            </View>
        }
    }

    renderLocationPicker() {
        if (this.state.showLocationPicker) {

            let mapHeight = Dimensions.get('window').height - 250

            return <View>
                <MapView style={{height: mapHeight}}
                         initialRegion={{
                             latitude: this.state.latitude,
                             longitude: this.state.longitude,
                             latitudeDelta: 0.0922,
                             longitudeDelta: 0.0421,
                         }}
                >
                    <Marker draggable
                            coordinate={{latitude: this.state.latitude, longitude: this.state.longitude}}
                            onDragEnd={(e) => {
                                this.setState({
                                    latitude: e.nativeEvent.coordinate.latitude,
                                    longitude: e.nativeEvent.coordinate.longitude,
                                })
                            }}
                            title="Meeting Spot"
                            description="Drag this to where you want to meet people."
                    />
                </MapView>
                <Button onPress={() => this.setState({
                    showLocationPicker: false,
                    showNamingForm: true,
                })} title={"Venue is Ready!"}/>
            </View>
        }
    }

    renderNamingForm() {
        if (this.state.showNamingForm) {


            return <View>
                <Text style={Layout.text}>Let's complete the final step and describe your workout.</Text>
                <View style={Layout.form}>
                    <TextInput
                        autoFocus={true}
                        returnKeyType={'next'}
                        placeholder={'Name Your Workout'}
                        style={Layout.textInputs}
                        onChangeText={text => this.setState({name: text})}
                        value={this.state.name}
                    />

                    <TextInput
                        multiline={true}
                        numberOfLines={5}
                        placeholder={'If you like, you can describe your plans and goals for this workout.'}
                        style={Layout.textAreaInputs}
                        onChangeText={text => this.setState({description: text})}
                        value={this.state.description}
                    />

                    {this.renderScheduleButton()}
                    {this.renderLoadingIcon()}

                </View>
            </View>
        }
    }

    renderScheduleButton() {
        return !this.state.posted ? <Button onPress={() => this.postWorkout()} title={"Schedule"}/> : null
    }

    renderLoadingIcon() {
        return this.state.loading ? <AntDesignIcon name="loading2"/> : null;
    }

    postWorkout() {
        const [{currentUserKey}, dispatch] = this.context;

        if (this._isMounted) {
            this.setState({loading:true, posted: true})
        }

        CreateWorkout(
            this.state.date,
            this.state.activity,
            this.state.name,
            this.state.description,
            this.state.latitude,
            this.state.longitude,
            currentUserKey
        ).then(json => {
            if (this._isMounted) {
                this.setState({loading:false})
            }

            this.props.doneHandler();

            let workout = {
                id: json.id,
                date: this.state.date,
                activity: this.state.activity,
                name: this.state.name,
                description: this.state.description,
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                joined: true,
                creator: true,
            };

            this.props.navigation.navigate("SingleWorkout", {workout: JSON.stringify(workout)});

            console.log(json.id)
        }).catch(error => {
            if (this._isMounted) {
                this.setState({loading:false})
            }
            console.log(error)
        })
    }

    render() {
        const [{currentUserKey}, dispatch] = this.context;

        if (currentUserKey) {
            return <View>
                {this.renderDatePicker()}
                {this.renderActivityPicker()}
                {this.renderLocationPicker()}
                {this.renderNamingForm()}
            </View>
        }

        return null
    }

}