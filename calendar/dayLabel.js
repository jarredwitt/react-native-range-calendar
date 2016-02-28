import React, { Component, View, Text, StyleSheet } from 'react-native';

class CalendarDayLabel extends Component {
  render() {
    return (
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{this.props.day}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  labelContainer: {
    flex: 1,
  },
  label: {
    textAlign: 'center',
    fontSize: 10,
    color: '#B6B6B6',
    fontFamily: 'avenir',
  },
});

export default CalendarDayLabel;
