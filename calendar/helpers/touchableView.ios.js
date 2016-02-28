import React, { Component, View, TouchableOpacity } from 'react-native';

class TouchableView extends Component {
  static propTypes = {
    style: View.propTypes.style,
    viewStyle: View.propTypes.style,
    onPress: React.PropTypes.func,
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
