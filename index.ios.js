import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Calendar from './calendar/calendar';

class CalendarRangePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.container}>
        <Calendar onDateChange={this._handleDateChange}/>
      </View>
    );
  }
  _handleDateChange = (range) => {
    this.setState({
      min: range
    });
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

AppRegistry.registerComponent('CalendarRangePicker', () => CalendarRangePicker);
