import React from 'react';
import {View, FlatList, Text, ScrollView, StyleSheet} from 'react-native';
import {ExpoLinksView} from '@expo/samples';
import * as firebase from 'firebase';
import RowItem from '../components/RowItem';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Newsfeed'
  };

  constructor() {
    super();
    var config = {
      apiKey: "AIzaSyCN-qoFr3Hrw20mU4wxiRQmRcTPGDFAYPc",
      authDomain: "medhacks2017-b5d81.firebaseapp.com",
      databaseURL: "https://medhacks2017-b5d81.firebaseio.com",
      projectId: "medhacks2017-b5d81",
      storageBucket: "medhacks2017-b5d81.appspot.com",
      messagingSenderId: "646098283900"
    };
    firebase.initializeApp(config);

    this.state = {
      rowData: []
    }
  }

  componentDidMount() {
    firebase
      .database()
      .ref('feelings')
      .on('child_added', snapshot => {
        console.log(snapshot.val());
        this.setState({
          rowData: this
            .state
            .rowData
            .concat({timestamp: snapshot.key, data: snapshot.val()})
        })
      })
  }

  render() {
    const {rowData} = this.state;

    return (
      <ScrollView style={styles.container}>
        <FlatList
          data={rowData}
          keyExtractor={(item, index) => index}
          renderItem={({item, key}) => {
            return (
              <View>
              <RowItem timestamp={item.timestamp} data={item.data}/>
              <RowItem timestamp={item.timestamp} data={item.data}/>

              </View>
            )
              }}/>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
