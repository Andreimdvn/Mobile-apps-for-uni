import React, {Component} from 'react';
import {StyleSheet, View, Image, Text, KeyboardAvoidingView, TextInput, Button} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";

export class LoginScreen extends React.Component {
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
                        />
                        <TextInput
                            placeholder="password"
                            placeholderTexColor="rgba(255,255,255,0.7)"
                            style={styles.input}
                        />
                        <Button
                            onPress={() => {
                                this.props.navigation.dispatch(StackActions.reset({
                                    index: 0,
                                    actions: [
                                        NavigationActions.navigate({ routeName: 'Details' })
                                    ],
                                }))
                            }}
                            title="Login"
                            color="#2980b9"
                            accessibilityLabel="Login"
                        />
                    </View>
                </View>

            </KeyboardAvoidingView>
        )
    }
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