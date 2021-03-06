package com.navigationhybrid;

import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.util.Log;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import me.listenzz.navigation.AwesomeFragment;
import me.listenzz.navigation.FragmentHelper;


/**
 * Created by Listen on 2017/11/20.
 */
public class NavigationModule extends ReactContextBaseJavaModule {

    static final String TAG = "ReactNative";
    private final Handler handler = new Handler(Looper.getMainLooper());
    private final ReactBridgeManager reactBridgeManager;

    NavigationModule(ReactApplicationContext reactContext, ReactBridgeManager reactBridgeManager) {
        super(reactContext);
        this.reactBridgeManager = reactBridgeManager;
    }

    @Override
    public String getName() {
        return "NavigationHybrid";
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        HashMap<String, Object> constants = new HashMap<>();
        constants.put("RESULT_OK", Activity.RESULT_OK);
        constants.put("RESULT_CANCEL", Activity.RESULT_CANCELED);
        return constants;
    }

    @ReactMethod
    public void startRegisterReactComponent() {
        handler.post(new Runnable() {
            @Override
            public void run() {
                reactBridgeManager.startRegisterReactModule();
            }
        });
    }

    @ReactMethod
    public void endRegisterReactComponent() {
        handler.post(new Runnable() {
            @Override
            public void run() {
                reactBridgeManager.endRegisterReactModule();
            }
        });
    }

    @ReactMethod
    public void registerReactComponent(final String appKey, final ReadableMap options) {
        handler.post(new Runnable() {
            @Override
            public void run() {
                reactBridgeManager.registerReactModule(appKey, options);
            }
        });
    }

    @ReactMethod
    public void signalFirstRenderComplete(final String sceneId) {
        handler.post(new Runnable() {
            @Override
            public void run() {
                AwesomeFragment awesomeFragment = findFragmentBySceneId(sceneId);
                if (awesomeFragment instanceof ReactFragment) {
                    ReactFragment fragment = (ReactFragment) awesomeFragment;
                    fragment.signalFirstRenderComplete();
                }
            }
        });
    }

    @ReactMethod
    public void setRoot(final ReadableMap layout, final boolean sticky) {
        handler.post(new Runnable() {
            @Override
            public void run() {
                reactBridgeManager.setRootLayout(layout, sticky);
                Activity activity = getCurrentActivity();
                if (activity instanceof ReactAppCompatActivity) {
                    ReactAppCompatActivity reactAppCompatActivity = (ReactAppCompatActivity) activity;
                    AwesomeFragment fragment = reactBridgeManager.createFragment(layout);
                    if (fragment != null) {
                        Log.i(TAG, "has active activity, set root directly");
                        reactAppCompatActivity.setActivityRootFragment(fragment);
                    }
                } else {
                    Log.w(TAG, "no active activity, schedule pending root");
                    reactBridgeManager.setPendingLayout(layout);
                }
            }
        });
    }

    @ReactMethod
    public void dispatch(final String sceneId, final String action, final ReadableMap extras) {
        handler.post(new Runnable() {
            @Override
            public void run() {
                AwesomeFragment fragment = findFragmentBySceneId(sceneId);
                reactBridgeManager.handleNavigation(fragment, action, extras);
            }
        });
    }

    @ReactMethod
    public void isNavigationRoot(final String sceneId, final Promise promise) {
        handler.post(new Runnable() {
            @Override
            public void run() {
                AwesomeFragment fragment = findFragmentBySceneId(sceneId);
                if (fragment != null) {
                    promise.resolve(fragment.isNavigationRoot());
                }
            }
        });
    }

    @ReactMethod
    public void setResult(final String sceneId, final int resultCode, final ReadableMap result) {
        handler.post(new Runnable() {
            @Override
            public void run() {
                AwesomeFragment fragment = findFragmentBySceneId(sceneId);
                if (fragment != null) {
                    fragment.setResult(resultCode, Arguments.toBundle(result));
                }
            }
        });
    }

    @ReactMethod
    public void currentRoute(final Promise promise) {
        handler.post(new Runnable() {
            @Override
            public void run() {
                Activity activity = getCurrentActivity();
                if (!(activity instanceof ReactAppCompatActivity)) {
                    FLog.w(TAG, "View Hierarchy is not ready when you call currentRoute");
                    promise.resolve(null);
                    return;
                }
                ReactAppCompatActivity reactAppCompatActivity = (ReactAppCompatActivity) activity;
                FragmentManager fragmentManager = reactAppCompatActivity.getSupportFragmentManager();
                Fragment fragment = fragmentManager.findFragmentById(android.R.id.content);
                HybridFragment current = getPrimaryFragment(fragment);

                if (current != null) {
                    Bundle bundle = new Bundle();
                    bundle.putString("moduleName", current.getModuleName());
                    bundle.putString("sceneId", current.getSceneId());
                    promise.resolve(Arguments.fromBundle(bundle));
                } else {
                    FLog.w(TAG, "View Hierarchy is not ready when you call currentRoute");
                    promise.resolve(null);
                }
            }
        });
    }

    private HybridFragment getPrimaryFragment(Fragment fragment) {
        if (fragment instanceof AwesomeFragment) {
            return reactBridgeManager.primaryFragment((AwesomeFragment) fragment);
        }
        return null;
    }

    @ReactMethod
    public void routeGraph(final Promise promise) {
        handler.post(new Runnable() {
            @Override
            public void run() {
                Activity activity = getCurrentActivity();
                if (!(activity instanceof ReactAppCompatActivity)) {
                    FLog.w(TAG, "View Hierarchy is not ready when you call Navigator#routeGraph. In order to avoid this warning, please use Navigator#setRootLayoutUpdateListener coordinately.");
                    promise.resolve(null);
                    return;
                }
                
                ReactAppCompatActivity reactAppCompatActivity = (ReactAppCompatActivity) activity;
                FragmentHelper.executePendingTransactionsSafe(reactAppCompatActivity.getSupportFragmentManager());

                ArrayList<Bundle> root = new ArrayList<>();
                ArrayList<Bundle> modal = new ArrayList<>();
                List<AwesomeFragment> fragments = reactAppCompatActivity.getFragmentsAtAddedList();
                for (int i = 0; i < fragments.size(); i++) {
                    AwesomeFragment fragment = fragments.get(i);
                    buildRouteGraph(fragment, root, modal);
                }
                root.addAll(modal);
                if (root.size() > 0) {
                    promise.resolve(Arguments.fromList(root));
                } else {
                    FLog.w(TAG, "View Hierarchy is not ready when you call Navigator#routeGraph. In order to avoid this warning, please use Navigator#setRootLayoutUpdateListener coordinately.");
                    promise.resolve(null);
                }
            }
        });
    }

    private void buildRouteGraph(AwesomeFragment fragment, ArrayList<Bundle> root, ArrayList<Bundle> modal) {
        reactBridgeManager.buildRouteGraph(fragment, root, modal);
    }

    private AwesomeFragment findFragmentBySceneId(String sceneId) {
        Activity activity = getCurrentActivity();
        if (activity instanceof ReactAppCompatActivity) {
            ReactAppCompatActivity reactAppCompatActivity = (ReactAppCompatActivity) activity;
            FragmentManager fragmentManager = reactAppCompatActivity.getSupportFragmentManager();
            return (AwesomeFragment)FragmentHelper.findDescendantFragment(fragmentManager, sceneId);
        }
        return null;
    }
}
