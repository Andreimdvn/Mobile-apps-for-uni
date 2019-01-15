import React from 'react';
import {View, Text, Button, KeyboardAvoidingView, Image, StyleSheet, TextInput, FlatList} from 'react-native';
import { createAppContainer, createStackNavigator, StackActions, NavigationActions } from 'react-navigation';
import {LoginScreen} from './Components/Login';
import { AsyncStorage } from "react-native"


class DetailsScreen extends React.Component {
        async fetchListData() {
        try {
            let response = await fetch('http://192.168.43.242:16000/api/listdata',
            { method: 'POST',
              headers: {
             'Content-Type': 'application/json',
            }});
            console.log(response);
            let responseJsonData = await response.json();
            console.log("Done!");
            console.log(responseJsonData);
            return responseJsonData;
        }
        catch(e) {
            console.log(e)
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            list_data: []
        };
        this.componentDidMount = this.componentDidMount.bind(this); //so i can access this in the method
    }

    async componentDidMount() {
        let list_data = null;
        let getListData = async () => {
            try {
                list_data = await AsyncStorage.getItem('list_data') || null;
            } catch (error) {
                console.log("Error at get list data!");
            }
            return list_data;
        };

        await getListData();

        if (list_data !== null) {
            console.log("We have data in storage. Will load it!");
            let data_from_storage = JSON.parse(list_data);
            this.setState({list_data: data_from_storage});
            console.log("Data was loaded from storage")
        }
        else {
            console.log("No data in storage!");
        }
        console.log("Request to getch list data");
        let fetched_list_data =  await this.fetchListData();
        try {
            console.log("Fetched list data:" + fetched_list_data);
            this.setState({list_data: fetched_list_data});
            let saveListData = async  wtf=> {
                try {
                    console.log("Will add 'list_data 'to local storage!");
                    await AsyncStorage.setItem('list_data', JSON.stringify(fetched_list_data));
                    console.log("Added 'list_data 'to local storage!");
                } catch (error) {
                    console.log("asyncstorage error at save list_data: "+ error);
                }
            };
            await saveListData();
        }
        catch (e) {
                console.log("Error at data fetch!");
        }
    }

  render(){
    return (
        <View style={styles.homeStyles}>
          <View style={{  alignItems: 'stretch', flexDirection: 'row',  justifyContent: 'space-between' ,
              marginBottom: 30}}>
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
              style={{height:30}}
          />
            <Text style={{ fontSize: 36, fontWeight: 'bold', marginHorizontal: 50}}>
                Keep it!
            </Text>
            <Button
                onPress={this.componentDidMount}
              title="Refresh"
              color="#2980b9"
              accessibilityLabel="Refresh"
              style={{height:30}}

            />
          </View>
          <FlatList
              data={this.state.list_data}
              showsVerticalScrollIndicator={true}
              renderItem={({item}) =>
                  <View style={styles.flatview}>
                    <Text style={styles.listdata}>{item.text}</Text>
                    <Text style={styles.importance}>{item.importance}</Text>
                  </View>
              }
              style={{flex:5}}
              keyExtractor={item => item.text}
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
  },
  flatview: {

      alignItems: 'stretch',
      flex:1,
    justifyContent: 'center',
    paddingTop: 30,
    borderRadius: 2,
  },
  listdata: {
    fontSize: 22
  },
  importance: {
    color: 'red',
    fontSize: 20
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