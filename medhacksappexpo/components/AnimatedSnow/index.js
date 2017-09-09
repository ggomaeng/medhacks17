import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

const NOTE_COUNT = 15;

const images = {
  0: require('./images/angry.png'),
  1: require('./images/contempt.png'),
  2: require('./images/disgusted.png'),
  3: require('./images/fear.png'),
  4: require('./images/neutral.png'),
  5: require('./images/sadness.png'),
  6: require('./images/smile.png'),
  7: require('./images/surprise.png'),
};

import MusicNote from './MusicNote';
import {getRandomIntInclusive} from './Random';

export default class AnimatedSnow extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    }
  }


  render() {

    const notes = [];



    if (this.state.width > 0 && this.state.height > 0) {
      for (let i = 0; i < NOTE_COUNT; i++) {
        notes.push(
          <MusicNote
            key={i}
            source= {images[getRandomIntInclusive(0, 7)]}
            width={this.state.width}
            height={this.state.height}
          />)
      }
    }

    return (
      <View {...this.props}
        onLayout={(e) => {
          const {width, height} = e.nativeEvent.layout;
          this.setState ({
            width: width,
            height: height
          });
        }}>

        {notes}

      </View>
    )
  }

}
