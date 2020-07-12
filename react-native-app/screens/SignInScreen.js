import * as React from 'react';
import Layout from '../constants/Layout';
import {Button, Text, TextInput, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import AppLogo from "../components/AppLogo";
import {SignIn, SignOut, SignUp} from "../backend/Api";
import AntDesignIcon from "../components/AntDesignIcon";
import {StateContext} from "../globalState";


export default class SignInScreen extends React.Component {

    _isMounted = false;

    static contextType = StateContext;

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',

            loading: false,
            errorMsg: false,
        };
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    performSignIn(email, password) {

        const [{}, dispatch] = this.context;

        if (this._isMounted) {
            this.setState({loading: true, errorMsg: false});
        }

        SignIn(email, password).then(res => {

            if (res.success) {
                if (this._isMounted) {
                    this.setState({
                        email: '',
                        password: '',
                        loading: false
                    });
                }

                dispatch({
                    type: 'setUserKey',
                    currentUserKey: res.sign_in_key,
                });
                dispatch({
                    type: 'updateUser',
                    user: {email: res.email},
                });
            }

            if (res.error && this._isMounted) {
                this.setState({password: '', errorMsg: res.error, loading: false});
            }

        }).catch(err => {
            if (this._isMounted) {
                this.setState({loading: false, errorMsg: err.data});
            }
        });
    }

    performSignOut() {
        const [{}, dispatch] = this.context;

        SignOut();
        dispatch({
            type: 'setUserKey',
            currentUserKey: null,
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

    renderLoginForm() {

        const [{currentUserKey}, dispatch] = this.context;

        if (currentUserKey) {
            return <View>
                <Text>You are already signed in.</Text>
                <Button onPress={() => this.performSignOut()} title={"Log out"}/>
            </View>
        }

        return <View>
            <View style={Layout.form}>
                <TextInput
                    autoFocus={true}
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

                <Button onPress={() => this.performSignIn(this.state.email, this.state.password)} title={"Sign In"}/>

            </View>
            <View style={Layout.helpLinkContainer}>
                <Text onPress={() => this.props.navigation.navigate("SignUp")} style={Layout.helpLinkText}>Got no
                    account?
                    Create one!</Text>
            </View>
        </View>;
    }

    render() {
        return (
            <View style={Layout.container}>
                <ScrollView style={Layout.container} contentContainerStyle={Layout.contentContainer}>
                    <AppLogo/>

                    {this.renderLoadingIcon()}
                    {this.renderErrorMessage()}

                    {this.renderLoginForm()}

                </ScrollView>

            </View>

        )
    };
}

SignInScreen.navigationOptions = {
    header: 'Sign In',
};