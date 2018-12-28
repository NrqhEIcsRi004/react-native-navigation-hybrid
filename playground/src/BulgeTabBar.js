import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  PixelRatio,
  Platform,
  Dimensions,
} from 'react-native';
import Badge from './Badge';

export default class BulgeTabBar extends Component {
  constructor(props) {
    super(props);
  }

  handleTabClick(index) {
    if (index == -1) {
      this.props.navigator.present('Result', 1);
    } else {
      this.props.navigator.switchTab(index);
    }
  }

  shouldComponentUpdate(next) {
    console.info(next);
    return true;
  }

  componentDidMount() {
    console.info('BulgeTabBar componentDidMount');
  }

  onComponentResult(requestCode, resultCode, data) {
    console.info('BulgeTabBar onComponentResult');
  }

  render() {
    const { itemColor, selectedItemColor, selectedIndex, badgeColor } = this.props;
    const style = {
      badgeStyle: { backgroundColor: badgeColor },
      redPointStyle: { backgroundColor: badgeColor },
      selectedItemColor,
      itemColor,
    };

    return (
      <View style={styles.container}>
        <View style={styles.tabBar}>
          <Tab
            onTabClick={() => this.handleTabClick(0)}
            {...this.props.tabs[0]}
            selected={selectedIndex == 0}
            {...style}
          />
          <Tab itemColor="rgb(255,197,99)" title="发布" />
          <Tab
            onTabClick={() => this.handleTabClick(1)}
            {...this.props.tabs[1]}
            selected={selectedIndex == 1}
            {...style}
          />
        </View>
        <TouchableOpacity
          onPress={() => this.handleTabClick(-1)}
          activeOpacity={0.8}
          style={styles.bulge}
        >
          <Image source={require('./images/tabbar_add_yellow.png')} />
        </TouchableOpacity>
      </View>
    );
  }
}

function Tab(props) {
  const {
    onTabClick,
    icon,
    title,
    selected,
    selectedItemColor,
    itemColor,
    badgeText,
    badgeStyle,
    remind,
    redPointStyle,
  } = props;
  return (
    <TouchableOpacity onPress={onTabClick} activeOpacity={0.8} style={styles.tab}>
      {icon ? (
        <Image
          source={{
            uri: icon,
            width: 24,
            height: 24,
            scale: PixelRatio.get(),
          }}
          style={{ tintColor: selected ? selectedItemColor : itemColor }}
          resizeMode="center"
        />
      ) : (
        <View style={{ width: 24, height: 24 }} />
      )}
      <Text
        style={
          selected
            ? [styles.buttonTextSelected, { color: selectedItemColor }]
            : [styles.buttonText, { color: itemColor }]
        }
      >
        {title}
      </Text>
      {badgeText && <Badge style={[styles.badge, badgeStyle]}>{badgeText}</Badge>}
      {remind && <Reminder style={redPointStyle} />}
    </TouchableOpacity>
  );
}

function Reminder(props) {
  return <View style={[styles.redPoint, props.style]} />;
}

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'android' ? 78 : 72,
    width: Dimensions.get('window').width,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  bulge: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    height: Platform.OS === 'android' ? 56 : 48,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    backgroundColor: 'transparent',
    fontSize: 12,
  },
  buttonTextSelected: {
    backgroundColor: 'transparent',
    fontSize: 12,
  },
  badge: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    marginBottom: 6,
    marginLeft: 6,
  },
  redPoint: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    marginBottom: 10,
    marginLeft: 10,
    height: 12,
    width: 12,
    borderWidth: 1,
    borderColor: '#fefefe',
    borderRadius: 14 / 2,
    backgroundColor: 'rgb(0, 122, 255)',
  },
});