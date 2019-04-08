import React from 'react';
import { ActivityIndicator, Button, KeyboardAvoidingView, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-simple-toast';
import {inject, observer} from "mobx-react/native";
import RNReactLogging from 'react-native-file-log';

import {LOGIN_STYLES} from '../styles';
import { locale }  from '../locale';

import CTS from '../utils/connectToServer';

@inject('store')
@observer
export default class LoginScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            email: '',
            password: ''
        };
    }
    //pavel.k@capstone.kz
    //ZOOMMAGo2018+!

    onLoginPress() {
        if (this.state.email.length > 0 && this.state.password.length > 0) {
            this.setState({isLoading: true});
            RNReactLogging.printLog('Connecting to Zoomia server');
            CTS.signUp(this.state.email, this.state.password)
                .then((response) => response.json())
                .then((data) => {
                    this.setState({isLoading: false});
                    if (data.success) {
                        this.props.store.addData(data.user_id, data.access_key, data.owners);
                        this.props.store.setInitialRoute('Main');
                        this.props.navigation.replace('Main');
                    } else {
                        if (data.tittle == "Password is not match") {
                            Toast.show(locale.signInErrorPassword);
                        } else if (data.error_message == "There is no user with mentioned EMail") {
                            Toast.show(locale.signInErrorEmail);
                        }
                    }

                    RNReactLogging.printLog('Received data for authentication...');
                    RNReactLogging.printLog(JSON.stringify(data));
                }).catch((err) => {
                this.setState({isLoading: false});
                RNReactLogging.printLog(JSON.stringify(err));
            });
        } else {
            Toast.show(locale.signInErrorInput);
        }
    }

    onChangeLang() {
        this.props.store.changeLang();
        this.setState({});
    }

    render() {
        let input;
        if (this.state.isLoading) {
            input = <View style={LOGIN_STYLES.spinner}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>;
        } else {
            input = <View>
                <TextInput
                    style={ LOGIN_STYLES.input }
                    placeholder={ locale.email }
                    keyboardType="email-address"
                    value={this.state.email}
                    onChangeText={ (text) => this.setState({email: text}) }/>
                <TextInput
                    style={ LOGIN_STYLES.input }
                    placeholder={ locale.password }
                    secureTextEntry={true}
                    value={this.state.password}
                    onChangeText={ (text) => this.setState({password: text}) }/>
                <View
                    style={{ margin:10 }} />
                <Button
                    color="#85ce36"
                    title={ locale.button }
                    onPress={ this.onLoginPress.bind(this) } />
                <View
                    style={{ marginBottom:10 }} />
            </View>;
        }
        return (
            <View
                style={ LOGIN_STYLES.screen } >
                <ScrollView contentContainerStyle={LOGIN_STYLES.scroll}>
                    <TouchableOpacity style={ LOGIN_STYLES.languageButton } onPress={ this.onChangeLang.bind(this) } >
                        <Text
                            style={ LOGIN_STYLES.language } >
                            { locale.language }
                        </Text>
                    </TouchableOpacity>
                    <KeyboardAvoidingView>
                        <Image
                            source={require('../images/logo.png')}
                            style={LOGIN_STYLES.logo}
                        />
                        <Text
                            style={ LOGIN_STYLES.title } >
                            { locale.enter }
                        </Text>
                        { input }
                    </KeyboardAvoidingView>
                </ScrollView>
            </View>
        );
    }
}