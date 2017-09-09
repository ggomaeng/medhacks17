import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View, Dimensions
} from 'react-native';

const ANGE_RANGE = 0.1;
const HALF_ANGLE_RANGE = ANGE_RANGE / 2;
const HALF_PI = Math.PI / 2;
const ANGLE_SEED = 100;
const ANGLE_DIVISOR = 10000;
const INCREMENT_LOWER = 2;
const INCREMENT_UPPER = 4;
const NOTE_SIZE_LOWER = 6;
const NOTE_SIZE_UPPER = 24;


import * as Random from './Random';

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

export default class MusicNote extends Component {

  constructor(props) {
    super(props);

    this.x = Random.getRandomInt(this.props.width);
    this.y = Random.getRandomInt(this.props.height);

    this.angle = Random.getRandomFloat(ANGLE_SEED) / ANGLE_SEED * ANGE_RANGE + HALF_PI - HALF_ANGLE_RANGE;
    this.increment = Random.getRandom(INCREMENT_LOWER, INCREMENT_UPPER);
    this.noteSize = Random.getRandom(NOTE_SIZE_LOWER, NOTE_SIZE_UPPER);
    this.opacity = Math.random() + 0.1;

  }

  componentDidMount(){
    this.updateInterval = setInterval(() => {
      this.move(this.props.width, this.props.height);
      this.forceUpdate();
    },50);
  }

  componentWillUnmount(){
    clearInterval(this.updateInterval);
  }

  move(width, height) {

    const x = this.x + (this.increment * Math.cos(this.angle));
    const y = this.y + (this.increment * Math.sin(this.angle));

    this.angle += Random.getRandom(-ANGLE_SEED, ANGLE_SEED) / ANGLE_DIVISOR;

    this.x = Math.floor(x);
    this.y = Math.floor(y);

    if (!this.isInside(width, height)) {
      this.reset(width);
    }



  }

  isInside(width, height) {
    const x = this.x;
    const y = this.y;
    const noteSize = this.noteSize;
    return x >= -noteSize - 1 && x + noteSize <= width && y >= -noteSize - 1 && y - noteSize < height;
  }

  reset(width) {
    const x = Random.getRandomInt(width);
    const y = (-this.noteSize - 1);
    const angle = Random.getRandomFloat(ANGLE_SEED) / ANGLE_SEED * ANGE_RANGE + HALF_PI - HALF_ANGLE_RANGE;

    this.x = x;
    this.y = y;
    this.angle = angle;
  }

  getPosition() {
    return {
      top: this.y,
      left: this.x,
      width: this.noteSize,
      height: this.noteSize,
      // borderRadius: this.noteSize / 2,
      opacity: this.opacity
    }
  }




  render() {
    const noteShape = this.getPosition();

    return (
      <Image source={this.props.source} {...this.props} style={[styles.note, noteShape]}/>
    )
  }
};

MusicNote.PropTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number
};

//Styles
const styles = StyleSheet.create({
  note: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
});
