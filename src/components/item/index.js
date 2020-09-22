import React, { Component } from "react";
import { TouchableOpacity } from "react-native";

import styles from "../styles";

export default class DropdownItem extends Component {
  static defaultProps = {
    color: "transparent",
    disableColor: "transparent",
    shaderBorderRadius: 0,
  };

  onPress() {
    let { onPress, index } = this.props;

    if (typeof onPress === "function") {
      onPress(index);
    }
  }

  render() {
    let { children, style, index, ...props } = this.props;
    console.log();
    return (
      <TouchableOpacity
        {...props}
        style={[styles.container, style]}
        onPress={this.onPress}
      >
        {children}
      </TouchableOpacity>
    );
  }
}
