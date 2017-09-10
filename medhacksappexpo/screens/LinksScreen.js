import React from 'react';
import {
  View,
  Dimensions,
  FlatList,
  Text,
  ScrollView,
  StyleSheet
} from 'react-native';
import {ExpoLinksView} from '@expo/samples';
import * as firebase from 'firebase';
import RowItem from '../components/RowItem';
import SmileScreen from '../components/AnimatedSnow';

const {width, height} = Dimensions.get('window');

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Newsfeed'
  };

  constructor() {
    super();

    this.state = {
      rowData: []
    }
  }

  componentDidMount() {
    
    firebase
      .database()
      .ref('feelings')
      .on('child_added', snapshot => {
        // console.log(snapshot.val());
        
        this.setState({
          rowData: this
            .state
            .rowData
            .concat({
              timestamp: snapshot.key,
              data: snapshot.val()
            })
        })
      })
  }

  render() {
    const {rowData} = this.state;
    return (
      <View style={{
        flex: 1
      }}>
        <SmileScreen
          ref='ss'
          style={{
          backgroundColor: '#fff',
          position: 'absolute',
          top: 0,
          width,
          height
        }}/>
        <ScrollView style={styles.container}>
          <FlatList
            data={rowData}
            keyExtractor={(item, index) => index}
            renderItem={({item, key}) => {
            return (<RowItem timestamp={item.timestamp} data={item.data}/>)
          }}/>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  }
});
