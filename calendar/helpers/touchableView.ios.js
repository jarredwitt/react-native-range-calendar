import React, { Component, PropTypes } from 'react';
import { View, TouchableOpacity } from 'react-native';

class TouchableView extends Component {
  static propTypes = {
    style: View.propTypes.style,
    viewStyle: View.propTypes.style,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    onPress: () => false,
  };

  render() {
    return (
      <TouchableOpacity style={this.props.style} onPress={this._handlePress}>
        <View style={this.props.viewStyle}>
          {this.props.children}
        </View>
      </TouchableOpacity>
    );
  }
  _handlePress = () => {
    this.props.onPress();
  };
}

export default TouchableView;
