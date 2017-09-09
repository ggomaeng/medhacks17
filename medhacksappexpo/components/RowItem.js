import React, {Component} from 'react';
import {View, Dimensions, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Colors from '../constants/Colors';
import * as moment from 'moment';
import {Ionicons} from '@expo/vector-icons'

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
    state = {
        collapsed: true
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
                console.log(average[i], '+', obj[key[i]]);
                average[i] += obj[key[i]];
            })

        average.map((feeling, i) => {
            average[key[i]] /= data.length;
        });

        console.log(average);

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
                    <View style={{alignSelf: 'center', width: 5, height: average[i] * 100, backgroundColor: Colors[key[i]]}}/>
                    <Text>{EMOJIS[i]}</Text>
                    <Text>{average[i].toFixed(2)}</Text>
                </View>
            )
        })

        return (
            <View style={{
                    backgroundColor: '#FAFAFA',
                    paddingVertical: 16, 
            }}>
                <View
                    style={{
                    width,
                    flexDirection: 'row'
                }}>
                    {views}
                </View>
            </View>
        )
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
                        borderBottomColor: '#eee',
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
            </View>
        )
    }
}