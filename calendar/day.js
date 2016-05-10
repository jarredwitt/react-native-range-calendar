import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';

import { TouchableView } from './helpers';

class CalendarDay extends Component {
  static propTypes = {
    day: React.PropTypes.instanceOf(moment),
    selected: React.PropTypes.bool,
    onDatePress: React.PropTypes.func,
  };

  static defaultProps = {
    selected: false,
    onDatePress: () => false,
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.selected !== this.props.selected || (nextProps.day && !nextProps.day.isSame(this.props.day, 'day'));
  }
  render() {
    let day = this.props.day ? this.props.day.date() : ' ';
    let style = [styles.day];
    if (this.props.selected) {
      style.push(styles.selected);
    }

    return (
      <TouchableView style={styles.dayContainer} onPress={this._handlePress} viewStyle={style}>
        <Text style={styles.dayText}>{day}</Text>
      </TouchableView>
    )
  }
  _handlePress = () => {
    this.props.day && this.props.onDatePress(this.props.day);
  };
}

const styles = StyleSheet.create({
  dayContainer: {
    flex: 1,
  },
  day: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  dayText: {
    fontSize: 18,
    fontFamily: 'avenir'
  },
  selected: {
    backgroundColor: '#F8D51C',
  }
});

export default CalendarDay;
