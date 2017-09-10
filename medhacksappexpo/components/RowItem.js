import React, {Component} from 'react';
import {
    View,
    Image,
    Modal,
    ActivityIndicator,
    Dimensions,
    Text,
    TouchableOpacity,
    StyleSheet,
    WebView
} from 'react-native';
import Colors from '../constants/Colors';
import * as moment from 'moment';
import {Ionicons} from '@expo/vector-icons'
import TimerMixin from 'react-timer-mixin';

import * as Animatable from 'react-native-animatable';

const {width, height} = Dimensions.get('window');

const NUM_FEELINGS = 7;
const EMOJIS = [
    '😡',
    '😥',
    '😷',
    '😨',
    '😁',
    '😶',
    '😢',
    '😯'
];

export default class RowItem extends Component {
    mixins = [TimerMixin]
    state = {
        collapsed: true,
        loading: false,
        activity: false,
        webviewload: false
    }

    renderViews() {
        const {collapsed} = this.state;
        if (collapsed) 
            return;
        
        const {data, timestamp} = this.props;
        const key = [
            'anger',
            'contempt',
            'disgust',
            'fear',
            'happiness',
            'neutral',
            'sadness',
            'surprise'
        ];

        //calculate data
        let average = key.map(() => 0);
        Object
            .keys(data)
            .map((pushKey, i) => {
                const obj = data[pushKey];
                // console.log(average[i], '+', obj[key[i]]);
                average[i] += obj[key[i]];
            })

        average.map((feeling, i) => {
            average[key[i]] /= data.length;
        });

        // console.log(average);

        const views = key.map((feeling, i) => {
            if (i >= NUM_FEELINGS) 
                return;
            
            // backgroundColor: Colors[key[i]]
            return (
                <View
                    key={i}
                    style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                }}>
                    <View
                        style={{
                        alignSelf: 'center',
                        width: 5,
                        height: average[i] * 100,
                        backgroundColor: Colors[key[i]]
                    }}/>
                    <Text>{EMOJIS[i]}</Text>
                    <Text>{average[i].toFixed(2)}</Text>
                </View>
            )
        })

        return (
            <View
                style={{
                backgroundColor: '#FAFAFA',
                paddingVertical: 16
            }}>
                <View
                    style={{
                    width,
                    flexDirection: 'row'
                }}>
                    {views}
                </View>
                <TouchableOpacity
                    onPress={() => {
                    this.setState({loading: true, activity: true, webviewload: true})
                }}
                    style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    marginTop: 8,
                    padding: 16,
                    margin: 8,
                    borderRadius: 8,
                    borderWidth: 1
                }}>
                    <Image
                        style={{
                        width: 24,
                        height: 24,
                        marginRight: 8
                    }}
                        source={require('../assets/images/chart.png')}/>
                    <Text style={{
                        fontWeight: '500'
                    }}>Generate Health Chart</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderWebView() {
        if (!this.state.webviewload) 
            return;
        
        return (<WebView
            source={{
            uri: 'https://www.dropbox.com/s/9d64g9gcywuqpmf/Psychological%20.pdf?dl=0&raw=true'
        }}
            style={{
            width,
            height
        }}/>)

    }

    render() {
        const {collapsed} = this.state;
        const {timestamp} = this.props;
        return (
            <View>
                <TouchableOpacity
                    onPress={() => this.setState({
                    collapsed: !collapsed
                })}>
                    <View
                        style={{
                        height: 64,
                        width,
                        padding: 16,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: 'gray',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Text
                            style={{
                            borderBottomWidth: 1,
                            fontWeight: '400',
                            borderBottomColor: '#F44336'
                        }}>{timestamp.toUpperCase()}</Text>

                        <Ionicons
                            name={collapsed
                            ? 'ios-arrow-down'
                            : 'ios-arrow-up'}
                            size={16}
                            color='#9e9e9e'/>
                    </View>

                </TouchableOpacity>
                {this.renderViews()}
                <Modal
                    visible={this.state.loading}
                    transparent={true}
                    style={{
                    flex: 1
                }}>
                    <View
                        style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, .6)'
                    }}>
                        <TouchableOpacity onPress={() => this.setState({webviewload: false, loading: false})}>
                            <Ionicons name='ios-close' color='white' size={40} style={{margin: 16}} />
                        </TouchableOpacity>
                        {this.renderWebView()}
                    </View>
                </Modal>
            </View>
        )
    }
}