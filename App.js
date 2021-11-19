import React from "react";

import {createAppContainer, createSwitchNavigator} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";
import {createBottomTabNavigator} from "react-navigation-tabs";
import {Ionicons} from "@expo/vector-icons";
import LoadingScreen from "./screens/LoadingScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import "expo-asset";
import MessageScreen from "./screens/MessageScreen";
import PostScreen from "./screens/PostScreen";
import NotificationScreen from "./screens/NotificationScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HomeScreen from "./screens/HomeScreen";

const AppContainer = createStackNavigator(
    {
        default: createBottomTabNavigator(
            {
                Home: {
                    screen: HomeScreen,
                    navigationOptions: {
                        tabBarIcon: ({tintColor}) => (
                            <Ionicons name="ios-home" size={24} color={tintColor}/>
                        ),
                        headerShown: false
                    },
                },
                Message: {
                    screen: MessageScreen,
                    navigationOptions: {
                        tabBarIcon: ({tintColor}) => (
                            <Ionicons name="ios-chatbox" size={24} color={tintColor}/>
                        ),
                        headerShown: false
                    },
                },
                Post: {
                    screen: PostScreen,
                    navigationOptions: {
                        tabBarIcon: ({tintColor}) => (
                            <Ionicons
                                name="ios-add-circle"
                                size={48}
                                color="#E9446A"
                                style={{
                                    shadowColor: "#E9446A",
                                    shadowOffset: {width: 0, height: 10},
                                    shadowRadius: 10,
                                    shadowOpacity: 0.3,
                                }}
                            />
                        ),
                        headerShown: false
                    },
                },
                Notification: {
                    screen: NotificationScreen,
                    navigationOptions: {
                        tabBarIcon: ({tintColor}) => (
                            <Ionicons name="ios-notifications" size={24} color={tintColor}/>
                        ),
                        headerShown: false
                    },
                },
                Profile: {
                    screen: ProfileScreen,
                    navigationOptions: {
                        tabBarIcon: ({tintColor}) => (
                            <Ionicons name="ios-person" size={24} color={tintColor}/>
                        ),
                        headerShown: false
                    },
                },
            },
            {
                defaultNavigationOptions: {
                    tabBarOnPress: ({navigation, defaultHandler}) => {
                        if (navigation.state.key === "Post") {
                            navigation.navigate("postModal");
                        } else {
                            defaultHandler();
                        }
                    },
                },
                tabBarOptions: {
                    activeTintColor: "#161F3D",
                    headerShown: false,
                    inactiveTintColor: "#B8BBC4",
                    showLabel: false,
                },
            }
        ),
        postModal: {
            screen: PostScreen,
        },
    },
    {
        mode: "modal",
        headerMode: "none",
        // initialRouteName: "postModal"
    }
);

const AuthStack = createStackNavigator({
    Login: LoginScreen,
    Register: RegisterScreen,
});

export default createAppContainer(
    createSwitchNavigator(
        {
            Loading: LoadingScreen,
            App: AppContainer,
            Auth: AuthStack,
        },
        {
            initialRouteName: "Loading",
        }
    )
);
