import React, { Component } from "react";
import {
  Text,
  TextInput,
  View,
  FlatList,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
} from "react-native";

import DropdownItem from "../item";
import styles from "../styles";

export default class Dropdown extends Component {
  static defaultProps = {
    hitSlop: { top: 6, right: 4, bottom: 6, left: 4 },

    disabled: false,

    data: [],

    valueExtractor: ({ value } = {}, index) => value,
    labelExtractor: ({ label } = {}, index) => label,
    propsExtractor: () => null,

    dropdownOffset: {
      top: 32,
      left: 0,
    },

    dropdownMargins: {
      min: 8,
      max: 16,
    },

    shadeOpacity: 0.12,

    animationDuration: 225,

    fontSize: 16,

    textColor: "#FFF",
    itemColor: "#FFF",
    baseColor: "#FFF",

    itemCount: 4,
    itemPadding: 8,

    supportedOrientations: [
      "portrait",
      "portrait-upside-down",
      "landscape",
      "landscape-left",
      "landscape-right",
    ],

    useNativeDriver: false,
  };

  blur = () => this.onClose();
  focus = this.onPress;

  mounted = false;
  focused = false;

  state = {
    opacity: new Animated.Value(0),
    selected: -1,
    modal: false,
    value: this.props,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.value != this.props.value) {
      this.setState({ value: prevProps.value });
    }
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onPress(event) {
    let {
      data,
      disabled,
      onFocus,
      itemPadding,
      dropdownOffset,
      dropdownMargins: { min: minMargin, max: maxMargin },
      animationDuration,
      useNativeDriver,
    } = this.props;

    if (disabled) {
      return;
    }

    let itemCount = data.length;
    let timestamp = Date.now();

    if (!itemCount) {
      return;
    }

    this.focused = true;

    if (typeof onFocus === "function") {
      onFocus();
    }

    let dimensions = Dimensions.get("window");

    this.container.measureInWindow((x, y, containerWidth) => {
      let { opacity } = this.state;

      let delay = Math.max(0, animationDuration - (Date.now() - timestamp));
      let selected = this.selectedIndex();

      let leftInset;
      let left = x + dropdownOffset.left - maxMargin;

      if (left > minMargin) {
        leftInset = maxMargin;
      } else {
        left = minMargin;
        leftInset = minMargin;
      }

      let right = x + containerWidth + maxMargin;
      let rightInset;

      if (dimensions.width - right > minMargin) {
        rightInset = maxMargin;
      } else {
        right = dimensions.width - minMargin;
        rightInset = minMargin;
      }

      let top = y + dropdownOffset.top - itemPadding;

      this.setState({
        modal: true,
        width: right - left,
        top,
        left,
        leftInset,
        rightInset,
        selected,
      });

      setTimeout(() => {
        if (this.mounted) {
          this.resetScrollOffset();
          Animated.timing(opacity, {
            duration: animationDuration,
            toValue: 1,
            useNativeDriver,
          }).start(() => {
            if (this.mounted && Platform.OS === "ios") {
              let { flashScrollIndicators } = this.scroll;

              if (typeof flashScrollIndicators === "function") {
                flashScrollIndicators.call(this.scroll);
              }
            }
          });
        }
      }, delay);
    });
  }

  onClose(value = this.state.value) {
    let { onBlur, animationDuration, useNativeDriver } = this.props;
    let opacity = this.state;

    Animated.timing(opacity, {
      duration: animationDuration,
      toValue: 0,
      useNativeDriver,
    }).start(() => {
      this.focused = false;
      if (typeof onBlur === "function") {
        onBlur();
      }
      if (this.mounted) {
        this.setState({ value, modal: false });
      }
    });
  }

  onSelect(index) {
    let { data, valueExtractor, onChangeText, animationDuration } = this.props;
    let value = valueExtractor(data[index], index);
    let delay = Math.max(0, animationDuration);
    if (typeof onChangeText === "function") {
      onChangeText(value, index, data);
    }
    setTimeout(() => this.onClose(value), delay);
  }

  onLayout(event) {
    let { onLayout } = this.props;
    if (typeof onLayout === "function") {
      onLayout(event);
    }
  }

  //A voir pour virer et mettre dans le rendu
  value() {
    let { value } = this.state;

    return value;
  }

  selectedIndex() {
    let { value } = this.state;
    let { data, valueExtractor } = this.props;

    return data.findIndex(
      (item, index) => null != item && value === valueExtractor(item, index)
    );
  }

  selectedItem() {
    let { data } = this.props;

    return data[this.selectedIndex()];
  }

  //A voir pour virer dans le rendu directement
  isFocused() {
    return this.focused;
  }

  itemSize() {
    let { fontSize, itemPadding } = this.props;

    return Math.ceil(fontSize * 1.5 + itemPadding * 2);
  }

  visibleItemCount() {
    let { data, itemCount } = this.props;

    return Math.min(data.length, itemCount);
  }

  tailItemCount() {
    return Math.max(this.visibleItemCount() - 2, 0);
  }

  resetScrollOffset() {
    let { selected } = this.state;
    let { data, dropdownPosition } = this.props;

    let offset = 0;
    let itemCount = data.length;
    let itemSize = this.itemSize();
    let tailItemCount = this.tailItemCount();
    let visibleItemCount = this.visibleItemCount();

    if (itemCount > visibleItemCount) {
      if (dropdownPosition == null) {
        switch (selected) {
          case -1:
            break;
          case 0:
          case 1:
            break;
          default:
            if (selected >= itemCount - tailItemCount) {
              offset = itemSize * (itemCount - visibleItemCount);
            } else {
              offset = itemSize * (selected - 1);
            }
        }
      } else {
        let index = selected - dropdownPosition;

        if (dropdownPosition < 0) {
          index -= visibleItemCount;
        }

        index = Math.max(0, index);
        index = Math.min(index, itemCount - visibleItemCount);

        if (!selected) {
          offset = itemSize * index;
        }
      }
    }

    if (this.scroll) {
      this.scroll.scrollToOffset({ offset, animated: false });
    }
  }

  keyExtractor(item, index) {
    let { valueExtractor } = this.props;

    return `${index}-${valueExtractor(item, index)}`;
  }

  renderBase(props) {
    let { value } = this.state;
    let { data, renderBase, labelExtractor, dropdownOffset } = this.props;

    let index = this.selectedIndex();
    let title;

    if (!index) {
      title = labelExtractor(data[index], index);
    }

    if (title == null) {
      title = value;
    }

    if (typeof renderBase === "function") {
      return renderBase({ ...props, title, value });
    }

    title = title == null || typeof title === "string" ? title : String(title);

    return <TextInput {...props} editable={false} />;
  }

  renderItems({ item, index }) {
    if (item == null) {
      return null;
    }

    let { selected, leftInset, rightInset } = this.state;

    let {
      valueExtractor,
      labelExtractor,
      propsExtractor,
      textColor,
      itemColor,
      baseColor,
      selectedItemColor = textColor,
      disabledItemColor = baseColor,
      fontSize,
      itemTextStyle,
      shadeOpacity,
    } = this.props;

    let props = propsExtractor(item, index);

    let { style, disabled } = (props = {
      shadeColor: baseColor,
      shadeOpacity,

      ...props,

      onPress: this.onSelect,
    });

    let value = valueExtractor(item, index);
    let label = labelExtractor(item, index);

    let title = label == null ? value : label;

    let color = disabled
      ? disabledItemColor
      : !selected
      ? selected === index
        ? selectedItemColor
        : itemColor
      : selectedItemColor;

    let textStyle = { color, fontSize };

    props.style = [
      style,
      {
        height: this.itemSize(),
        paddingLeft: leftInset,
        paddingRight: rightInset,
      },
    ];

    return (
      <DropdownItem index={index} {...props}>
        <Text style={[styles.item, itemTextStyle, textStyle]} numberOfLines={1}>
          {title}
        </Text>
      </DropdownItem>
    );
  }

  render() {
    let {
      renderBase,
      containerStyle,
      overlayStyle: overlayStyleOverrides,
      pickerStyle: pickerStyleOverrides,

      hitSlop,
      pressRetentionOffset,
      testId,
      nativeID,
      accessible,
      accessibilityLabel,

      supportedOrientations,
      ...props
    } = this.props;

    let { data, disabled, itemPadding, dropdownPosition } = props;

    let { left, top, width, opacity, selected, modal } = this.state;

    let overlayStyle = { opacity };
    let itemCount = data.length;
    let visibleItemCount = this.visibleItemCount();
    let tailItemCount = this.tailItemCount();
    let itemSize = this.itemSize();

    let height = 2 * itemPadding + itemSize * visibleItemCount;
    let translateY = -itemPadding;

    if (dropdownPosition == null) {
      switch (selected) {
        case -1:
          translateY -= 1 === itemCount ? 0 : itemSize;
          break;

        case 0:
          break;

        default:
          if (selected >= itemCount - tailItemCount) {
            translateY -=
              itemSize * (visibleItemCount - (itemCount - selected));
          } else {
            translateY -= itemSize;
          }
      }
    } else {
      if (dropdownPosition < 0) {
        translateY -= itemSize * (visibleItemCount + dropdownPosition);
      } else {
        translateY -= itemSize * dropdownPosition;
      }
    }

    let pickerStyle = {
      width,
      height,
      top,
      left,
      transform: [{ translateY }],
    };

    let touchableProps = {
      disabled,
      hitSlop,
      pressRetentionOffset,
      onPress: this.onPress,
      testID,
      nativeID,
      accessible,
      accessibilityLabel,
    };
    return (
      <View onLayout={this.onLayout} style={containerStyle}>
        <TouchableWithoutFeedback {...touchableProps}>
          <View pointerEvents="box-only">{this.renderBase(props)}</View>
        </TouchableWithoutFeedback>

        <Modal
          visible={modal}
          transparent
          onRequestClose={this.blur}
          supportedOrientations={supportedOrientations}
        >
          <Animated.View
            style={[styles.overlay, overlayStyle, overlayStyleOverrides]}
            onStartShouldSetResponder={() => true}
            onResponderRelease={this.blur}
          >
            <View
              style={[styles.picker, pickerStyle, pickerStyleOverrides]}
              onStartShouldSetResponder={() => true}
            >
              <FlatList
                data={data}
                style={styles.scroll}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                scrollEnabled={visibleItemCount < itemCount}
                contentContainerStyle={styles.scrollContainer}
              />
            </View>
          </Animated.View>
        </Modal>
      </View>
    );
  }
}
