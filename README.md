[npm-badge]: https://img.shields.io/npm/v/react-simple-material-dropdown.svg?colorB=ff6d00
[npm-url]: https://www.npmjs.com/package/react-native-simple-dropdown
[license-badge]: https://img.shields.io/npm/l/react-native-simple-dropdown.svg?colorB=448aff

# react-native-simple-dropdown

[![npm][npm-badge]][npm-url]
![license][license-badge]

Simple dropdown on iOS and Android

Based on [react-native-material-dropdown](https://github.com/n4kz/react-native-material-dropdown)

## Installation

```bash
$ npm install --save react-native-simple-dropdown
```

For React-Native < 0.60 users:

```bash
$ react-native link
```

For React-Native > 0.60 and CocoaPods users

```bash
$ cd ios && pod install && cd ..
```

## Usage

```javascript
import React, { Component } from "react";
import { Dropdown } from "react-native-simple-dropdown";

class Example extends Component {
  render() {
    let data = [
      {
        value: "Banana",
      },
      {
        value: "Mango",
      },
      {
        value: "Pear",
      },
    ];

    return <Dropdown label="Favorite Fruit" data={data} />;
  }
}
```

## Properties

## Methods
