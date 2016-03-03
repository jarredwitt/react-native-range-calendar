import React, { Component, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';

import { TouchableView } from './helpers';
import CalendarDay from './day';
import CalendarDayLabel from './dayLabel';

const RANGE = 'range';
const SINGLE = 'single';
const MONTH_NAMES = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
const DAY_NAMES = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];

class Calendar extends Component {
  static propTypes = {
    date: React.PropTypes.oneOfType([
      React.PropTypes.instanceOf(Date),
      React.PropTypes.instanceOf(moment),
      React.PropTypes.object,
    ]),
    selectionType: React.PropTypes.oneOf([RANGE, SINGLE]),
    onDateChange: React.PropTypes.func,
  };

  static defaultProps = {
    date: moment(),
    selectionType: SINGLE,
    onDateChange: () => false,
  };

  constructor(props) {
    super(props);

    this.isRange = props.selectionType === RANGE;
    let selected;
    let year;
    let month;
    if (this.isRange){
      if (!moment.isMoment(props.date) && props.date.min && props.date.max) {
        selected = {
          min: props.date.min,
          max: props.date.max
        };
        year = props.date.max.year();
        month = props.date.max.month();
      } else {
        selected = {};
        year = moment().year();
        month = moment().month();
      }
    } else {
      selected = props.date;
      year = props.date.year();
      month = props.date.month();
    }

    this.state = {
      year,
      month,
      selected,
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    // Implemented this custom update because we don't want to have to re-render
    // 30+ views if we don't have to because the external state of this component changed.
    let shouldUpdate = this._checkProps(this.props, nextProps);
    if (shouldUpdate) {
      return true;
    }

    shouldUpdate = this._checkState(this.state, nextState);
    return shouldUpdate;
  }
  render() {
    let calendarMonth = new moment().year(this.state.year).month(this.state.month).date(1);
    let dayOffset = calendarMonth.day();
    let monthNumberOfDays = calendarMonth.endOf('month').date();

    let calendarDates = this._getCalendarDates(monthNumberOfDays, dayOffset, this.state.year, this.state.month);

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarTopContainer}>
          <TouchableView style={styles.calendarTopPrevContainer} onPress={this._handlePrevPress}>
            <Text style={styles.calendarTopPrevText}>Prev</Text>
          </TouchableView>
          <View style={styles.calendarTopMonthYearContainer}>
            <Text style={styles.calendarTopMonthYearText}>
              {`${MONTH_NAMES[this.state.month]} ${this.state.year}`}
            </Text>
          </View>
          <TouchableView style={styles.calendarTopNextContainer} onPress={this._handleNextPress}>
            <Text style={styles.calendarTopNextText}>Next</Text>
          </TouchableView>
        </View>
        <View style={styles.calendarDayLabelContainer}>
          {DAY_NAMES.map((day, index) => (
            <CalendarDayLabel key={index} day={day} />
          ))}
        </View>
        {calendarDates.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.calendarWeekRow}>
            {row.map((day, dayIndex) => this._buildCalendarDate(day, dayIndex))}
          </View>
        ))}
        {this.isRange &&
          <TouchableView onPress={this._handleClearRange} style={styles.clearRangeContainer}>
            <Text style={styles.clearRangeText}>Clear Range</Text>
          </TouchableView>
        }
      </View>
    );
  }
  _checkProps = (current, next) => {
    // We only check the date matches the initial date since that is the only prop
    // that would change on the re-render.
    if (this.isRange && !moment.isMoment(current.date)) {
      if (!current.date.min) {
        return true;
      }

      let update = current.date.min.isSame(next.date.min, 'day');
      if (update) {
        return true;
      }

      return current.date.max.isSame(next.date.max, 'day');
    }

    return !current.date.isSame(next.date, 'day');
  };
  _checkState = (current, next) => {
    // State is a bit more tricky since we are dealing with moment objects. We need to an actual comparison of selected.
    if (current.year !== next.year) {
      return true;
    }

    if (current.month !== next.month) {
      return true;
    }

    if (this.isRange) {
      if (!current.selected.min && !current.selected.max) {
        // means we are setting it for the first time.
        return true;
      }

      if (!next.selected.min && !next.selected.max) {
        // means we cleared the range.
        return true;
      }

      if (current.selected.min.isBefore(next.selected.min, 'day')) {
        // means we moved the range to an earlier date.
        return true;
      }

      if (!current.selected.max.isSame(next.selected.max, 'day')) {
        return true;
      }

      return false;
    } else {
      if (!current.selected.isSame(next.selected, 'day')) {
        return true;
      }

      return false;
    }
  };
  _getCalendarDates = (numberOfDays, offset, year, month) => {
    let calendar = [];
    let currentRow = [];
    for(let i = 0; i < numberOfDays + offset; i++) {
      if (i !== 0 && i % 7 === 0) {
        calendar.push(currentRow);
        currentRow = [];
      }

      if (i < offset) {
        currentRow.push(null);
      } else {
      	let day = i + 1 - offset;
        currentRow.push(new moment().year(year).month(month).date(day));
      }
    }

    if (currentRow.length) {
      if (currentRow.length < 7) {
        let difference = 7 - currentRow.length;
        for (let i = 0; i < difference; i++) {
          currentRow.push(null);
        }
      }

      calendar.push(currentRow);
    }

    return calendar;
  };
  _buildCalendarDate = (day, dayIndex) => {
    let selected = false;

    if (this.isRange) {
      if (this.state.selected.min && this.state.selected.max) {
        selected = day && day.isBetween(this.state.selected.min, this.state.selected.max, 'day');
        if (!selected) {
          selected = (day && day.isSame(this.state.selected.min, 'day')) || (day && day.isSame(this.state.selected.max, 'day'));
        }
      }
    } else {
      selected = this.state.selected.isSame(day, 'day');
    }

    return <CalendarDay key={dayIndex} day={day} selected={selected} onDatePress={this._handleDateChange} />;
  };
  _handlePrevPress = () => {
    let month = this.state.month;
    let year = this.state.year;

    if (month === 0) {
      month = 11;
      year--;
    } else {
      month--;
    }

    let state = Object.assign({}, this.state, {
      month,
      year,
    });

    this.setState(state);
  };
  _handleNextPress = () => {
    let month = this.state.month;
    let year = this.state.year;

    if (month === 11) {
      month = 0;
      year++;
    } else {
      month++;
    }

    this.setState({
      month,
      year,
    });
  };
  _handleClearRange = () => {
    selected = {};
    this.setState({
      selected,
    });
    this.props.onDateChange(selected);
  };
  _handleDateChange = (date) => {
    let selected = date;

    if (this.isRange) {
      selected = Object.assign({}, this.state.selected);
      // Need to short cicuit if the date is the same as the min and both min and max are set.
      // This clears the range.
      if (date.isSame(selected.min, 'day') && (selected.min && selected.max)) {
        selected = {};
        this.setState({
          selected,
        });
        this.props.onDateChange(selected);
        return;
      }

      if (date.isBefore(selected.min, 'day') || !selected.min) {
        selected.min = date;
      }

      selected.max = date;
    }

    this.setState({
      selected,
    });

    this.props.onDateChange(selected);
  };
}

const styles = StyleSheet.create({
  calendarTextBase: {
    fontFamily: 'avenir',
  },
  calendarContainer: {
    alignSelf: 'stretch',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 5,
  },
  calendarTopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  calendarTopPrevContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  calendarTopPrevText: {
    flex: 1,
    fontFamily: 'avenir',
    fontSize: 15,
    color: '#B6B6B6'
  },
  calendarTopMonthYearContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarTopMonthYearText: {
    flex: 1,
    fontFamily: 'avenir',
    fontSize: 18
  },
  calendarTopNextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarTopNextText: {
    flex: 1,
    fontFamily: 'avenir',
    fontSize: 15,
    color: '#B6B6B6'
  },
  calendarDayLabelContainer: {
    flexDirection: 'row',
    marginBottom: 5
  },
  calendarWeekRow: {
    flexDirection: 'row',
    marginBottom: 1,
    padding: 1,
  },
  clearRangeContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  clearRangeText: {
    flex: 1,
    fontFamily: 'avenir',
    fontSize: 15,
    color: '#B6B6B6'
  }
});

export default Calendar;
