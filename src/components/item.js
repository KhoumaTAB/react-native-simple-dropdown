import React, { Component } from "react";
import { Button } from "react-native-material-buttons";

import styles from "./styles";

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

    return (
      <Button
        {...props}
        style={[styles.container, style]}
        onPress={this.onPress}
      >
        {children}
      </Button>
    );
  }
}
