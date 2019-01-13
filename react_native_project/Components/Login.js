limport React, {Component} from 'react';
import {StyleSheet, View, Image, Text, KeyboardAvoidingView, TextInput, Button} from 'react-native';
import { AsyncStorage } from "react-native"
import {NavigationActions, StackActions} from "react-navigation";


export class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_input: '',
            password_input: ''
        };
        this.loginPressed = this.loginPressed.bind(this); //so i can access this in the method
    }
    render(){
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logo}
                        source={require('../Images/bulblogo.png')}/>
                    <Text style={styles.title}>Keep it App</Text>
                </View>
                <View style={styles.formContainer}>
                    <View style={styles.containerLogin}>
                        <TextInput
                            placeholder="username"
                            placeholderTexColor="rgba(255,255,255,0.7)"
                            style={styles.input}
                            onChangeText={TextInputValue => this.setState(  {user_input: TextInputValue})}
                        />
                        <TextInput
                            secureTextEntry={true}
                            placeholder="password"
                            placeholderTexColor="rgba(255,255,255,0.7)"
                            style={styles.input}
                            onChangeText={TextInputValue => this.setState({password_input: TextInputValue})}
                        />
                        <Button
                            onPress={this.loginPressed}
                            title="Login"
                            color="#2980b9"
                            accessibilityLabel="Login"
                        />
                    </View>
                </View>

            </KeyboardAvoidingView>
        )
    }

    async loginPressed() {
        console.log(this.state);
        let loginToken = '';
        let getLoginToken = async () => {
            try {
                console.log("Will get token from local storage!");
                loginToken = await AsyncStorage.getItem('login_token') || '';
            } catch (error) {
                console.log("Error at login get token!");
            }
        };
        await getLoginToken();
        if (loginToken !== '') {
            console.log("We have login_token!");
            console.log(loginToken);
            this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({routeName: 'Details'})
                ],
            }));
            return;
        }
        else
        {
            console.log("No token in local storage!");
        }

        console.log("Sending login req!");
        try {
            fetch('http://localhost:16000/api/login', {
                method: 'POST',
                timeout: 5,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "user": this.state['user_input'],
                    "password": this.state['password_input'],
                })
            })
                .then((response) => response.json())
                .then(async (responseJson) => {
                    let loginToken = responseJson['token'];
                    if (responseJson['status'] === 'True') {
                        let saveLoginToken = async wtf => {
                            try {
                                console.log("Will add login token to local storage!");
                                await AsyncStorage.setItem('login_token', loginToken);
                                console.log("Added login_token to local storage!");
                            } catch (error) {
                                console.log("asyncstorage error at save login_token: " + error.message)
                            }
                        };
                        await saveLoginToken();
                        this.props.navigation.dispatch(StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({routeName: 'Details'})
                            ],
                        }))
                    } else {
                        alert("Invalid credentials");
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }catch (error){
            alert("Network error.")
        }
    };
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#34495e'
    },
    logoContainer: {
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    logo:{
        width: 100,
        height: 100
    },
    title: {
        color: '#FFF',
        marginTop: 10,
        textAlign: 'center'
    },
    formContainer:{
        flex: 2
    },
    containerLogin:{
        padding:20,
        marginBottom: 140
    },
    input:{
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 20,
        color: '#FFF',
        paddingHorizontal: 10
    }
});