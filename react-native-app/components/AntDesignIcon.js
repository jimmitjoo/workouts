import {AntDesign} from '@expo/vector-icons';
import * as React from 'react';

import Colors from '../constants/Colors';
import {loadSingleFontAsync} from "expo-font/build/FontLoader";

export default class AntDesignIcon extends React.Component {

    constructor(props) {
        super(props);

        this.props = props;
    }

    async componentDidMount() {
      await AntDesign.loadFont()
    }

  render() {
        return (
            <AntDesign
                name={this.props.name}
                size={30}
                style={{marginBottom: -3}}
                color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
            />
        );
    }
}
