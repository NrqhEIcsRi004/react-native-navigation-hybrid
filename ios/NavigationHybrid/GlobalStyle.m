//
//  GlobalStyle.m
//  NavigationHybrid
//
//  Created by Listen on 2018/2/8.
//  Copyright © 2018年 Listen. All rights reserved.
//

#import "GlobalStyle.h"
#import "HBDUtils.h"

@interface GlobalStyle ()

@property (nonatomic, copy, readonly) NSDictionary *options;

@property (nonatomic, assign) UIBarStyle barStyle;
@property (nonatomic, strong) UIImage *shadowImage;
@property (nonatomic, strong) UIImage *backIcon;
@property (nonatomic, strong) UIColor *barTintColor;
@property (nonatomic, strong) UIColor *tintColor;
@property (nonatomic, strong) UIColor *titleTextColor;
@property (nonatomic, assign) NSInteger titleTextSize;
@property (nonatomic, assign) NSInteger barButtonItemTextSize;

@property (nonatomic, strong) UIColor *tabBarBackgroundColor;
@property (nonatomic, strong) UIImage *tabBarShadowImage;
@property (nonatomic, strong) UIColor *tabBarTintColor;
@property (nonatomic, strong) UIColor *tabBarUnselectedTintColor;

@end

@implementation GlobalStyle

- (instancetype)initWithOptions:(NSDictionary *)options {
    if (self = [super init]) {
        _options = options;
        
        // screenBackgroundColor
        NSString *screenBackgroundColor = options[@"screenBackgroundColor"];
        if (screenBackgroundColor) {
            _screenBackgroundColor = [HBDUtils colorWithHexString:screenBackgroundColor];
        } else {
            _screenBackgroundColor = UIColor.whiteColor;
        }
        
        NSString *topBarStyle = self.options[@"topBarStyle"];
        if (topBarStyle && [topBarStyle isEqualToString:@"light-content"]) {
            self.barStyle = UIBarStyleBlack;
        } else {
            self.barStyle = UIBarStyleDefault;
        }
        
        // topBarColor
        NSString *topBarColor = self.options[@"topBarColor"];
        if (topBarColor) {
            self.barTintColor = [HBDUtils colorWithHexString:topBarColor];
        }
        
        // navigationBar shadowImeage
        NSDictionary *shadowImeage = self.options[@"shadowImage"];
        if (shadowImeage && ![shadowImeage isEqual:NSNull.null]) {
            UIImage *image = [UIImage new];
            NSDictionary *imageItem = shadowImeage[@"image"];
            NSString *color = shadowImeage[@"color"];
            if (imageItem) {
                image = [HBDUtils UIImage:imageItem];
            } else if (color) {
                image = [HBDUtils imageWithColor:[HBDUtils colorWithHexString:color]];
            }
            self.shadowImage = image;
        }

        // hideBackTitle
        NSNumber *hideBackTitle = options[@"hideBackTitleIOS"];
        if (!hideBackTitle) {
            hideBackTitle = options[@"hideBackTitle"];
        }
        if (hideBackTitle) {
            _backTitleHidden = [hideBackTitle boolValue];
        }
        
        // backIcon
        NSDictionary *backIcon = self.options[@"backIcon"];
        if (backIcon) {
            self.backIcon = [HBDUtils UIImage:backIcon];
        }
        
        // topBarTintColor,
        NSString *topBarTintColor = self.options[@"topBarTintColor"];
        if (topBarTintColor) {
            self.tintColor = [HBDUtils colorWithHexString:topBarTintColor];
        }
        
        // titleTextColor,
         NSString *titleTextColor = self.options[@"titleTextColor"];
        if (titleTextColor) {
            self.titleTextColor = [HBDUtils colorWithHexString:titleTextColor];
        }
        
        // titleTextSize
        NSNumber *titleTextSize = self.options[@"titleTextSize"];
        if (titleTextSize) {
            self.titleTextSize = [titleTextSize integerValue];
        } else {
            self.titleTextSize = 17;
        }

        NSNumber *barButtonItemTextSize = self.options[@"barButtonItemTextSize"];
        if (barButtonItemTextSize) {
            self.barButtonItemTextSize = [barButtonItemTextSize integerValue];
        } else {
            self.barButtonItemTextSize = 15;
        }
        
        // tabBarColor
        NSString *tabBarColor = self.options[@"tabBarColor"];
        if (tabBarColor) {
            self.tabBarBackgroundColor = [HBDUtils colorWithHexString:tabBarColor];
        }
        
        // shadowImeage
        NSDictionary *tabBarShadowImage = self.options[@"tabBarShadowImage"];
        if (tabBarShadowImage && ![tabBarShadowImage isEqual:NSNull.null]) {
            UIImage *image = [UIImage new];
            NSDictionary *imageItem = tabBarShadowImage[@"image"];
            NSString *color = tabBarShadowImage[@"color"];
            if (imageItem) {
                image = [HBDUtils UIImage:imageItem];
            } else if (color) {
                image = [HBDUtils imageWithColor:[HBDUtils colorWithHexString:color]];
            }
            self.tabBarShadowImage = image;
        }
        
        // tabBar tintColor
        NSString *tabBarItemColor = self.options[@"tabBarItemColor"];
        self.tabBarItemColorHexString = @"#BDBDBD";
        self.tabBarSelectedItemColorHexString = @"#FF5722";
        if (tabBarItemColor) {
            self.tabBarTintColor = [HBDUtils colorWithHexString:tabBarItemColor];
            self.tabBarSelectedItemColorHexString = tabBarItemColor;
            NSString *tabBarSelectedItemColor = self.options[@"tabBarSelectedItemColor"];
            if (tabBarSelectedItemColor) {
                self.tabBarTintColor = [HBDUtils colorWithHexString:tabBarSelectedItemColor];
                self.tabBarUnselectedTintColor = [HBDUtils colorWithHexString:tabBarItemColor];
                self.tabBarItemColorHexString = tabBarItemColor;
                self.tabBarSelectedItemColorHexString = tabBarSelectedItemColor;
            }
        }
        
        NSString *badgeColor = self.options[@"badgeColor"];
        self.badgeColorHexString = @"#FF3B30";
        if (@available(iOS 10.0, *)) {
            if (badgeColor) {
                [UITabBarItem appearance].badgeColor = [HBDUtils colorWithHexString:badgeColor];
                self.badgeColorHexString = badgeColor;
            }
        } else {
            // Fallback on earlier versions
            
        }
    }
    return self;
}

- (void)inflateNavigationBar:(UINavigationBar *)navigationBar {
    
    [navigationBar setBarStyle:self.barStyle];
    if (self.barTintColor) {
        [navigationBar setBarTintColor:self.barTintColor];
    }
    
    if (self.shadowImage) {
        [navigationBar setShadowImage:self.shadowImage];
    }
    
    if (self.backIcon) {
        [navigationBar setBackIndicatorImage:self.backIcon];
        [navigationBar setBackIndicatorTransitionMaskImage:self.backIcon];
    }
    
    if (self.tintColor) {
        [navigationBar setTintColor:self.tintColor];
    }
    
    // title
    NSMutableDictionary *titleAttributes = [[NSMutableDictionary alloc] init];
    if (self.titleTextColor) {
        [titleAttributes setObject:self.titleTextColor forKey:NSForegroundColorAttributeName];
    }
    [titleAttributes setObject:[UIFont systemFontOfSize:self.titleTextSize] forKey:NSFontAttributeName];
    [navigationBar setTitleTextAttributes:titleAttributes];
}

- (void)inflateBarButtonItem:(UIBarButtonItem *)barButtonItem {
    NSMutableDictionary *attributes = [[NSMutableDictionary alloc] init];
    [attributes setObject:[UIFont systemFontOfSize:self.barButtonItemTextSize] forKey:NSFontAttributeName];
    [barButtonItem setTitleTextAttributes:attributes forState:UIControlStateNormal];
    [barButtonItem setTitleTextAttributes:attributes forState:UIControlStateHighlighted];
    [barButtonItem setTitleTextAttributes:attributes forState:UIControlStateDisabled];
}

- (void)inflateTabBar:(UITabBar *)tabBar {
    if (self.tabBarBackgroundColor) {
        [tabBar setBackgroundImage:[HBDUtils imageWithColor:self.tabBarBackgroundColor]];
    }
    
    if (self.tabBarShadowImage) {
         [tabBar setShadowImage:self.tabBarShadowImage];
    }
    
    if (self.tabBarTintColor) {
        [tabBar setTintColor:self.tabBarTintColor];
    }

    if (@available(iOS 10.0, *)) {
        if (self.tabBarUnselectedTintColor) {
            [tabBar setUnselectedItemTintColor:self.tabBarUnselectedTintColor];
        }
    }
}

@end
