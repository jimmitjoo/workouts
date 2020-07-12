import * as React from 'react';
import {Button, Text, TextInput, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Layout from "../constants/Layout";
import AppLogo from "../components/AppLogo";
import {SignUp} from "../backend/Api";
import AntDesignIcon from "../components/AntDesignIcon";
import {StateContext} from "../globalState";

export default class SignUpScreen extends React.Component {

    _isMounted = false;

    static contextType = StateContext;

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            password: '',

            loading: false,
            errorMsg: false,
            signedIn: false,
        };
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    performSignUp() {

        const [{}, dispatch] = this.context;

        if (this._isMounted) {
            this.setState({
                loading: true,
                errorMsg: false,
            })
        }

        SignUp(this.state.name, this.state.email, this.state.password).then(res => {

            if (res.success && this._isMounted) {

                dispatch({
                    type: 'setUserKey',
                    currentUserKey: res.sign_in_key,
                });
                dispatch({
                    type: 'updateUser',
                    user: {
                        firstname: this.state.name,
                        email: this.state.email
                    },
                });

                navigator.navigate("SignIn");
            }

            if (res.error && this._isMounted) {
                this.setState({
                    errorMsg: res.error, loading: false,
                });
            }

        }).catch(err => {

            if (this._isMounted) {
                this.setState({
                    loading: false,
                    errorMsg: err.data,
                })
            }

        });

    }

    renderLoadingIcon() {
        return this.state.loading ? <AntDesignIcon name="loading2"/> : null;
    }

    renderErrorMessage() {

        let render = null;
        if (this.state.errorMsg) {
            render = <Text style={Layout.errorMessage}>{this.state.errorMsg}</Text>
        }

        return render
    }

    render() {
        return (
            <View style={Layout.container}>
                <ScrollView style={Layout.container} contentContainerStyle={Layout.contentContainer}>
                    <AppLogo/>

                    {this.renderLoadingIcon()}
                    {this.renderErrorMessage()}

                    <View style={Layout.form}>
                        <TextInput
                            autoFocus={true}
                            returnKeyType={'next'}
                            placeholder={'Your Name'}
                            style={Layout.textInputs}
                            onChangeText={text => this.setState({name: text})}
                            value={this.state.name}
                        />
                        <TextInput
                            returnKeyType={'next'}
                            keyboardType={'email-address'}
                            placeholder={'your@email.com'}
                            textContentType={'emailAddress'}
                            style={Layout.textInputs}
                            onChangeText={text => this.setState({email: text})}
                            value={this.state.email}
                        />
                        <TextInput
                            returnKeyType={'go'}
                            keyboardType={'visible-password'}
                            placeholder={'Password'}
                            secureTextEntry={true}
                            textContentType={'password'}
                            style={Layout.textInputs}
                            onChangeText={text => this.setState({password: text})}
                            value={this.state.password}
                        />

                        <Button
                            onPress={() => this.performSignUp(this.state.name, this.state.email, this.state.password)}
                            title={"Create Account"}/>

                    </View>

                    <View style={Layout.helpLinkContainer}>
                        <Text onPress={() => this.props.navigation.navigate("SignIn")} style={Layout.helpLinkText}>Already
                            got an
                            account? Login here!</Text>
                    </View>

                </ScrollView>

            </View>

        );
    }
}

SignUpScreen.navigationOptions = {
    header: 'Sign Up',
};

