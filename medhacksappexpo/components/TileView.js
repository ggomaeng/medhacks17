import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';

import { NavigationActions } from 'react-navigation';

const {width, height} = Dimensions.get('window');

export default class TileView extends Component {
    render() {
        const {backgroundColor, text, emoji, value} = this.props;

        const numb = (value * 100).toFixed(3);
        const numbText = !isNaN(numb) ? numb : (0).toFixed(3);
            
        return (
            <TouchableOpacity style={[styles.container]}>
                <View style={[styles.innerContainer, {backgroundColor}]}>
                    <Text style={{fontSize: 100, position: 'absolute', right: -10, opacity: 0.75, bottom: 0, backgroundColor: 'transparent'}}>{emoji}</Text>
                    <Text style={styles.titleText}>{text}</Text>
                    <Text style={styles.percentText}>{numbText}%</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: width / 2,
        height: width / 2,
        padding: 6,
    }, 
    innerContainer: {
        flex: 1,
        borderRadius: 16,
        padding: 8
    },
    titleText: {
        backgroundColor: 'transparent',
        color: 'white',
        fontSize: 24,
        fontWeight: '600'
    },
    percentText: {
        backgroundColor: 'transparent',
        color: 'white',
        fontSize: 18,
        fontWeight: '300'
    }
})