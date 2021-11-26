import React from "react";
import {View, Text, StyleSheet, Button, Image, FlatList, TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import moment from "moment";
import Fire from "../Fire";
import { doc } from "prettier";

export default class ProfileScreen extends React.Component {
    state = {
        users: [],
        oneUser: {}
    };

    unsubscribe = null;

    async getPosts (userId) {
        const postsCollection = await Fire.shared.firestore
        .collection(`users/` + userId + `/postData`)
        .get()

        return postsCollection.docs.map(doc => ({...doc.data(), id: doc.id}));
    }
    
    async getUser (userId) {
        const doc = await Fire.shared.firestore
        .collection(`users`)
        .doc(userId)
        .get()

        
        const user = doc.data()
        
        user.id = doc.id
        user.posts = await this.getPosts(user.id)
        return user
    }

    async componentDidMount() {
        const user = this.props.uid || Fire.shared.uid; 
    
        const currentUser = await this.getUser(user)
        this.setState({oneUser: currentUser})

        const usersCollection = await Fire.shared.firestore
            .collection(`users`)
            .get()

        const users = await Promise.all(usersCollection.docs.map(async doc => {
            const user = doc.data()
            user.id = doc.id
            user.posts = await this.getPosts(user.id)
            return user
        }))

        this.setState({users})        
    }

    dropPost = (postID) => {
        console.log(postID);
        const user = this.props.uid || Fire.shared.uid;
        const dropPost = Fire.shared.firestore
            .collection(`users/` + user + `/postData`)
            .doc(postID)
            .delete()
            .then(() => {
                console.log("Post deleted");
            })
        return dropPost
    }

    renderPost = (post) => {
        return (
                    <View style={styles.feedItem}>
                    <Image source={{uri: this.state.oneUser.avatar}} style={styles.avatar}/>
                    <View style={{flex: 1}}>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <View>
                                <Text style={styles.name}>{this.state.oneUser.name}</Text>
                                <Text style={styles.timestamp}>
                                    {moment(post.timestamp).fromNow()}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => this.dropPost(post.id)}>
                                <Ionicons name="ios-trash" size={24} color="#73788B"/>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.post}>{post.text}</Text>
                        <Image
                            source={{uri: post.image}}
                            style={styles.postImage}
                            resizeMode="cover"
                        />
                        <View style={{flexDirection: "row"}}>
                        <TouchableOpacity>
                            <Ionicons
                                name="heart-outline"
                                size={24}
                                color="#73788B"
                                style={{marginRight: 16}}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="ios-chatbox-outline" size={24} color="#73788B"/>
                        </TouchableOpacity>
                        </View>
                    </View>
                </View>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={{marginTop: 64, alignItems: "center"}}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={
                                {uri: this.state.oneUser.avatar}
                            }
                            style={styles.avatarUser}
                        />
                    </View>
                    <Text style={styles.name}>{this.state.oneUser.name}</Text>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.stat}>
                        <Text style={styles.statAmount}>21</Text>
                        <Text style={styles.statTitle}>Posts</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statAmount}>981</Text>
                        <Text style={styles.statTitle}>Followers</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statAmount}>63</Text>
                        <Text style={styles.statTitle}>Following</Text>
                    </View>
                </View>

                <Button
                    onPress={() => {
                        Fire.shared.signOut();
                    }}
                    title="Log out"
                />
                <FlatList 
                    style={styles.feed}
                    renderItem={({item}) => this.renderPost(item)}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    data={this.state.oneUser.posts}
                />    
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    profile: {
        marginTop: 64,
        alignItems: "center"
    },
    avatarContainer: {
        shadowColor: "#151734",
        shadowRadius: 30,
        shadowOpacity: 0.4
    },
    avatarUser: {
        width: 136,
        height: 136,
        borderRadius: 68
    },
    name: {
        marginTop: 24,
        fontSize: 16,
        fontWeight: "600"
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 32
    },
    stat: {
        alignItems: "center",
        flex: 1
    },
    statAmount: {
        color: "#4F566D",
        fontSize: 18,
        fontWeight: "300"
    },
    statTitle: {
        color: "#C3C5CD",
        fontSize: 12,
        fontWeight: "500",
        marginTop: 4
    },
    feedItem: {
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 8,
        flexDirection: "row",
        marginVertical: 8,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 16,
    },
    name: {
        fontSize: 15,
        fontWeight: "500",
        color: "#454D65",
    },
    timestamp: {
        fontSize: 11,
        color: "#C4C6CE",
        marginTop: 4,
    },
    post: {
        marginTop: 16,
        fontSize: 14,
        color: "#838899",
    },
    postImage: {
        width: undefined,
        height: 150,
        borderRadius: 5,
        marginVertical: 16,
    },
    feed: {
        marginHorizontal: 16,
    },
});
