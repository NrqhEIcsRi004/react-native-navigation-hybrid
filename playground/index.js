import {
  ReactRegistry,
  Garden,
  Navigator,
  router,
  BarStyleDarkContent,
  BarStyleLightContent,
  TitleAlignmentCenter,
} from 'react-native-navigation-hybrid';
import { Image, Platform } from 'react-native';
import React, { Component } from 'react';

import { Provider } from 'react-redux';

import Navigation from './src/Navigation';
import Result from './src/Result';
import Options from './src/Options';
import Menu from './src/Menu';
import PassOptions from './src/PassOptions';
import ReduxCounter, { store } from './src/ReduxCounter';
import Lifecycle from './src/Lifecycle';

import TopBarMisc from './src/TopBarMisc';
import Noninteractive from './src/Noninteractive';
import TopBarShadowHidden from './src/TopBarShadowHidden';
import TopBarHidden from './src/TopBarHidden';
import TopBarColor from './src/TopBarColor';
import TopBarAlpha from './src/TopBarAlpha';
import TopBarTitleView, { CustomTitleView } from './src/TopBarTitleView';
import TopBarStyle from './src/TopBarStyle';
import StatusBarColor from './src/StatusBarColor';
import Transparent from './src/Transparent';
import HUDTest from './src/HUDText';
import ReactModal from './src/ReactModal';
import StatusBarHidden from './src/StatusBarHidden';
import CustomTabBar from './src/CustomTabBar';
import BulgeTabBar from './src/BulgeTabBar';
import Welcome from './src/Welcome';

// import MessageQueue from 'react-native/Libraries/BatchedBridge/MessageQueue.js';
// const spyFunction = msg => {
//   console.debug(msg);
// };
// MessageQueue.spy(spyFunction);



function withRedux(WrappedComponent) {
  class ReduxProvider extends Component {
    componentDidMount() {
      // 获取 displayName
      console.info(`displayName:${ReduxProvider.displayName}`);
    }

    render() {
      return (
        <Provider store={store}>
          <WrappedComponent {...this.props} />
        </Provider>
      );
    }
  }
  ReduxProvider.displayName = `WithRedux(${WrappedComponent.displayName})`;
  return ReduxProvider;
}

// 开始注册组件，即基本页面单元
ReactRegistry.startRegisterComponent(withRedux);

ReactRegistry.registerComponent('Welcome', () => Welcome);
ReactRegistry.registerComponent('Navigation', () => Navigation);
ReactRegistry.registerComponent('Result', () => Result, { path: 'result', mode: 'present' });
ReactRegistry.registerComponent('Options', () => Options, { path: 'options' });
ReactRegistry.registerComponent('Menu', () => Menu, { path: 'menu' });
ReactRegistry.registerComponent('ReduxCounter', () => ReduxCounter, { path: 'redux' });
ReactRegistry.registerComponent('PassOptions', () => PassOptions);
ReactRegistry.registerComponent('Lifecycle', () => Lifecycle);

ReactRegistry.registerComponent('TopBarMisc', () => TopBarMisc, { dependency: 'Options' });
ReactRegistry.registerComponent('Noninteractive', () => Noninteractive);
ReactRegistry.registerComponent('TopBarShadowHidden', () => TopBarShadowHidden);
ReactRegistry.registerComponent('TopBarHidden', () => TopBarHidden);
ReactRegistry.registerComponent('TopBarAlpha', () => TopBarAlpha, {
  path: 'topBarAlpha/:alpha/:color',
  dependency: 'TopBarMisc',
});
ReactRegistry.registerComponent('TopBarColor', () => TopBarColor, {
  path: 'topBarColor/:color',
  dependency: 'TopBarMisc',
});
ReactRegistry.registerComponent('TopBarTitleView', () => TopBarTitleView);
ReactRegistry.registerComponent('CustomTitleView', () => CustomTitleView);
ReactRegistry.registerComponent('StatusBarColor', () => StatusBarColor);
ReactRegistry.registerComponent('StatusBarHidden', () => StatusBarHidden);
ReactRegistry.registerComponent('TopBarStyle', () => TopBarStyle);

ReactRegistry.registerComponent('Transparent', () => Transparent);
ReactRegistry.registerComponent('HUDTest', () => HUDTest);
ReactRegistry.registerComponent('ReactModal', () => ReactModal, { path: 'modal', mode: 'modal' });

ReactRegistry.registerComponent('CustomTabBar', () => CustomTabBar);
ReactRegistry.registerComponent('BulgeTabBar', () => BulgeTabBar);

// 完成注册组件
ReactRegistry.endRegisterComponent();




// 激活 DeepLink，在 Navigator.setRoot 之前
Navigator.setRootLayoutUpdateListener(
  () => {
    router.inactivate();
  },
  () => {
    const prefix = Platform.OS == 'android' ? 'hbd://hbd/' : 'hbd://';
    router.activate(prefix);
  }
);



function startApp() {

  // 设置全局样式
  Garden.setStyle({
    screenBackgroundColor: '#F8F8F8',
    topBarStyle: BarStyleLightContent,
    titleTextSize: 17,
    topBarColor: '#FFFFFF',

    swipeBackEnabledAndroid: true,
    topBarTintColor: '#000000',
    // badgeColor: '#00FFFF',
    // titleTextColor: '#00ff00',
    titleAlignmentAndroid: TitleAlignmentCenter,
    // backIcon: Image.resolveAssetSource(require('./src/images/ic_settings.png')),
    shadowImage: {
      color: '#DDDDDD',
      // image: Image.resolveAssetSource(require('./src/images/divider.png')),
    },
    // hideBackTitleIOS: true,
    elevationAndroid: 1,

    tabBarColor: '#FFFFFF',
    tabBarShadowImage: {
      color: '#F0F0F0',
      // image: Image.resolveAssetSource(require('./src/images/divider.png')),
    },

    //tabBarItemColor: '#CCCCCC',
    //tabBarSelectedItemColor: '#00ff00',
  });


  Navigator.setRoot({
    stack: {
      children: [{screen: {moduleName: 'Welcome'}}]
    }
  })
}

startApp()




// 设置导航拦截器
Navigator.setInterceptor((action, from, to, extras) => {
  console.info(`action:${action} from:${from} to:${to}`);
  // 不拦截任何操作
  return false;
});
