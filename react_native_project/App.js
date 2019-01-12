import React from 'react';
import {View, Text, Button, KeyboardAvoidingView, Image, StyleSheet, TextInput} from 'react-native';
import { createAppContainer, createStackNavigator, StackActions, NavigationActions } from 'react-navigation';
import {LoginScreen} from './Components/Login';


global.server_host = "asd";

class DetailsScreen extends React.Component {
  render(){
    return (
        <View style={styles.homeStyles}>
          <Text >Keep it!</Text>
          <Button
              onPress={()=>{this.props.navigation.dispatch(StackActions.reset({
              index: 0,
              actions: [
              NavigationActions.navigate({ routeName: 'Home' })
              ],
              }))}}
              title="Logout"
              color="#2980b9"
              accessibilityLabel="Logout"
          />
        </View>
    )
  }
}

const styles =StyleSheet.create({
  homeStyles: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const AppNavigator = createStackNavigator({
  Home: {
    screen: LoginScreen,
  },
  Details: {
    screen: DetailsScreen,
  },
}, {
  initialRouteName: 'Home',
});

export default createAppContainer(AppNavigator);