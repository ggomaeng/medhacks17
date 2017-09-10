import React from 'react';
import {
    Animated,
    Image,
    FlatList,
    Platform,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const {width, height} = Dimensions.get('window');

import {WebBrowser} from 'expo';

import {MonoText} from '../components/StyledText';
import TileView from '../components/TileView';
import * as firebase from 'firebase';
import moment from 'moment';
import Colors from '../constants/Colors';
import _ from 'lodash';

export default class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Health Data'
    };

    state = {
        backgroundColor: '#eee',
        opacity: new Animated.Value(1),
        happy: 0,
        sad: 0,
        angry: 0,
        surprise: 0,
        neutral: 0,
        fear: 0,
        disgust: 0,
        contempt: 0
    }

    componentDidMount() {
        const time = moment().format('dddd, MMMM Do YYYY');
        const feelingKeys = [
            'anger',
            'contempt',
            'disgust',
            'fear',
            'happiness',
            'neutral',
            'sadness',
            'surprise'
        ];

        const feelingColors = {
            'anger': Colors.anger,
            'contempt': Colors.contempt,
            'disgust': Colors.disgust,
            'fear': Colors.fear,
            'happiness': Colors.happiness,
            'neutral': Colors.neutral,
            'sadness': Colors.sadness,
            'surprise': Colors.surprise
        };

        firebase
            .database()
            .ref(`feelings/${time}`)
            .on('value', snapshot => {
                if (snapshot.val()) {
                    // console.log('value:', snapshot.val());
                    const calculatedData = this.calculate(snapshot.val());
                }

            });

        firebase
            .database()
            .ref(`feelings/${time}`)
            .limitToLast(1)
            .on('child_added', snapshot => {
                if (snapshot.val()) {
                    let obj = snapshot.val();
                    if (obj && obj.timestamp) {
                        delete obj.timestamp
                    }
                    const highestIndex = Object
                        .keys(obj)
                        .reduce(function (a, b) {
                            return obj[a] > obj[b]
                                ? a
                                : b
                        });
                    console.log(highestIndex);
                    console.log('highest is ', feelingKeys[highestIndex]);
                    this.changeBG(feelingColors[highestIndex]);

                }

            });
    }

    changeBG(color) {
        if (!color) 
            return

        this.setState({backgroundColor: color});
        Animated.sequence([
            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: 300
            }),
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 500
            })
        ]).start();

    }

    calculate(data) {
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
        var average = key.map(() => 0);
        var prevData = [];

        Object
            .keys(data)
            .map((pushKey, i) => {
                const obj = data[pushKey];
                average[i] += obj[key[i]];
                prevData[i] = [];
                prevData[i].concat(obj[key[i]]);
            })

        average.map((feeling, i) => {
            average[key[i]] /= data.length;
        });

        this.setState({
            angry: { value: average[0], data: prevData[0] },
            contempt: { value: average[1], data: prevData[1] },
            disgust: { value: average[2], data: prevData[2] },
            fear: { value: average[3], data: prevData[3] },
            happy: { value: average[4], data: prevData[4] },
            neutral: { value: average[5], data: prevData[5] },
            sad: { value: average[6], data: prevData[6] },
            surprise: { value: average[7], data: prevData[7] },
        })

    }

    render() {
        const {
            happy,
            sad,
            angry,
            surprise,
            neutral,
            fear,
            disgust,
            contempt,
            opacity,
            backgroundColor
        } = this.state;
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                flex: 1
            }}>
                <Animated.View
                    style={{
                    backgroundColor,
                    opacity,
                    height: height * 2,
                    width,
                    position: 'absolute',
                    left: 0,
                    top: 0
                }}/>
                <View style={styles.container}>
                    <TileView
                        backgroundColor={'#F48FB1'}
                        text={'Happy'}
                        emoji={'😁'}
                        value={happy.value}/>
                    <TileView backgroundColor={'#096B92'} text={'Sad'} emoji='😢' value={sad.value}/>
                    <TileView backgroundColor={'#FF4C3D'} text={'Angry'} emoji='😡' value={angry.value}/>
                    <TileView
                        backgroundColor={'#79C8A8'}
                        text={'Surprise'}
                        emoji='😯'
                        value={surprise.value}/>
                    <TileView
                        backgroundColor={'#FFB74D'}
                        text={'Neutral'}
                        emoji='😶'
                        value={neutral.value}/>
                    <TileView backgroundColor={'#CE93D8'} text={'Fear'} emoji='😨' value={fear.value}/>
                    <TileView
                        backgroundColor={'#9CCC65'}
                        text={'Disgust'}
                        emoji='😷'
                        value={disgust.value}/>
                    <TileView
                        backgroundColor={'#84C4E8'}
                        text={'Contempt'}
                        emoji='😥'
                        value={contempt.value}/>
                </View>
            </ScrollView>

        );
    }

    _maybeRenderDevelopmentModeWarning() {
        if (__DEV__) {
            const learnMoreButton = (
                <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
                    Learn more
                </Text>
            );

            return (
                <Text style={styles.developmentModeText}>
                    Development mode is enabled, your app will be slower but you can use useful
                    development tools. {learnMoreButton}
                </Text>
            );
        } else {
            return (
                <Text style={styles.developmentModeText}>
                    You are not in development mode, your app will run at full speed.
                </Text>
            );
        }
    }

    _handleLearnMorePress = () => {
        WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
    };

    _handleHelpPress = () => {
        WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-c' +
                'hanges');
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: 'transparent'
    },
    developmentModeText: {
        marginBottom: 20,
        color: 'rgba(0,0,0,0.4)',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center'
    },
    contentContainer: {
        paddingTop: 30
    },
    welcomeContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20
    },
    welcomeImage: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10
    },
    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50
    },
    homeScreenFilename: {
        marginVertical: 7
    },
    codeHighlightText: {
        color: 'rgba(96,100,109, 0.8)'
    },
    codeHighlightContainer: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 3,
        paddingHorizontal: 4
    },
    getStartedText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        lineHeight: 24,
        textAlign: 'center'
    },
    tabBarInfoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: {
                    height: -3
                },
                shadowOpacity: 0.1,
                shadowRadius: 3
            },
            android: {
                elevation: 20
            }
        }),
        alignItems: 'center',
        backgroundColor: '#fbfbfb',
        paddingVertical: 20
    },
    tabBarInfoText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        textAlign: 'center'
    },
    navigationFilename: {
        marginTop: 5
    },
    helpContainer: {
        marginTop: 15,
        alignItems: 'center'
    },
    helpLink: {
        paddingVertical: 15
    },
    helpLinkText: {
        fontSize: 14,
        color: '#2e78b7'
    }
});
