import React from "react";
import {View, Text, StyleSheet, Image, FlatList} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import moment from "moment";
import Fire from "../Fire";

export default class HomeScreen extends React.Component {
    state = {
        users: []
    };

    async componentDidMount() {
        const user = this.props.uid || Fire.shared.uid;

        const usersCollection = await Fire.shared.firestore
            .collection(`users`)
            .get()

        const users = await Promise.all(usersCollection.docs.map(async doc => {
            const user = doc.data()

            const postsCollection = await Fire.shared.firestore
                .collection(`users/` + doc.id + `/postData`)
                .get()

            user.id = doc.id
            user.posts = postsCollection.docs.map(doc => doc.data());
            return user
        }))

        this.setState({users});
    }

    renderPost = (user) => {
        console.log(user)
        return (
            <>
                {user.posts.map(post => (<View style={styles.feedItem}>
                    <Image source={{uri: user.avatar}} style={styles.avatar}/>
                    <View style={{flex: 1}}>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <View>
                                <Text style={styles.name}>{user.name}</Text>
                                <Text style={styles.timestamp}>
                                    {moment(post.timestamp).fromNow()}
                                </Text>
                            </View>

                            <Ionicons name="md-arrow-redo-outline" size={24} color="#73788B"/>
                        </View>
                        <Text style={styles.post}>{post.text}</Text>
                        <Image
                            source={{uri: post.image}}
                            style={styles.postImage}
                            resizeMode="cover"
                        />
                        <View style={{flexDirection: "row"}}>
                            <Ionicons
                                name="heart-outline"
                                size={24}
                                color="#73788B"
                                style={{marginRight: 16}}
                            />
                            <Ionicons name="ios-chatbox-outline" size={24} color="#73788B"/>
                        </View>
                    </View>
                </View>))}
            </>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Feed</Text>
                </View>

                <FlatList
                    style={styles.feed}
                    renderItem={({item}) => this.renderPost(item)}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    data={this.state.users}
                />

                {/*{this.state.users.map(user => (*/}
                {/*    <Text style={styles.post}>{user.avatar}</Text>)*/}
                {/*)}*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EBECF4",
    },
    header: {
        paddingTop: 40,
        paddingBottom: 16,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EBECF4",
        shadowColor: "#454D65",
        shadowOffset: {height: 5},
        shadowRadius: 15,
        shadowOpacity: 0.2,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "500",
    },
    feed: {
        marginHorizontal: 16,
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
});
