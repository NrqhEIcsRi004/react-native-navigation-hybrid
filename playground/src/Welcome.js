import React, { Component } from 'react';
import { TouchableOpacity, Text, View, StatusBar, Platform } from 'react-native';
import { Garden,Navigator } from 'react-native-navigation-hybrid';

const navigationStack = {
  stack: {
    children: [{ screen: { moduleName: 'Navigation' } }],
  },
};

const optionsStack = {
  stack: {
    children: [{ screen: { moduleName: 'Options' } }],
  },
};

const tabs = {
  tabs: {
    children: [navigationStack, optionsStack],
    options: {
      //tabBarModuleName: 'BulgeTabBar',
      //sizeIndeterminate: true,
      //tabBarModuleName: 'CustomTabBar',
      //sizeIndeterminate: false,
      //selectedIndex: 1,
    },
  },
};


const menu = { screen: { moduleName: 'Menu' } };

const drawer = {
  drawer: {
    children: [tabs, menu],
    options: {
      maxDrawerWidth: 280,
      minDrawerMargin: 64,
    },
  },
};



export default class Welcome extends Component {

  static navigationItem = {
    topBarHidden: true,
    backInteractive: true,
    swipeBackEnabled: true,
  }

  constructor(props) {
    super(props);

  }

  componentDidAppear() {
    console.info('Welcome componentDidAppear');
  }

  componentDidDisappear() {
    console.info('Welcome componentDidDisappear');
  }

  componentDidMount() {
    console.info('Welcome componentDidMount');
  }

  push() {
    // 设置 UI 层级
    Navigator.setRoot(drawer);
  }


  render() {
    return (
      <View style={{
        flex:1,
        marginTop:100
      }}>
        <Text style={{
          textAlign:'center'
        }}>This's a React Native welcome.</Text>

        <TouchableOpacity onPress={this.push} activeOpacity={0.2} >
          <Text style={{
            textAlign:'center',
            color:'blue'
          }}>push to main page</Text>
        </TouchableOpacity>

      </View>
    );
  }
}
