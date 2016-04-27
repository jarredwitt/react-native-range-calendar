import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';
import moment from 'moment';

import Calendar from './calendar/calendar';

class CalendarRangePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.container}>
        <Calendar closeText={this.props.closeText} selectionType="range" date={{ min: new moment().year(2016).month(1).date(3), max: new moment().year(2016).month(1).date(9)}}/>
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
    marginTop: 100,
  }
});

AppRegistry.registerComponent('CalendarRangePicker', () => CalendarRangePicker);
