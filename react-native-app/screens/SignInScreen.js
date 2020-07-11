import * as React from 'react';
import Layout from '../constants/Layout';
import {Button, Text, TextInput, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import AppLogo from "../components/AppLogo";
import {SignIn, SignOut, SignUp} from "../backend/Api";
import AntDesignIcon from "../components/AntDesignIcon";
import * as SecureStore from "expo-secure-store";



export default class SignInScreen extends React.Component {

    state = {
        email: '',
        password: '',

        loading: false,
        errorMsg: false,
        signedIn: false,
    };

    componentDidMount() {

        SecureStore.getItemAsync('signInKey').then(signInKey => {
            console.log({'signInKey': signInKey});
            if (signInKey === null) {
                this.setState({signedIn: false});
            } else if (signInKey !== "") {
                this.setState({signedIn: true});
            }
        })
    }

    performSignIn(email, password) {

        this.setState({loading: true, errorMsg: false});

        SignIn(email, password).then(res => {

            if (res.success) {
                this.setState({
                    email: '',
                    password: '',
                    signedIn: true
                });

                dispatch({
                    type: 'changeUserStatus',
                    signedIn: { signedIn: true }
                })
            }

            if (res.error) {
                this.setState({password: '', errorMsg: res.error});
            }

            this.setState({loading: false});

        }).catch(err => {

            this.setState({loading: false});

            this.setState({errorMsg: err.data});
        });
    }

    performSignOut() {
        SignOut();
        this.setState({signedIn: false});
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

        if (this.state.signedIn === true) {
            return <View>
                <Text>You are already signed in.</Text>
                <Button onPress={() => this.performSignOut()} title={"Log out"}/>
            </View>
        }

        return <View><View style={Layout.form}>
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
                <Text onPress={() => navigation.navigate("SignUp")} style={Layout.helpLinkText}>Got no account?
                    Create one!</Text>
            </View></View>;
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