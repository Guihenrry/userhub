import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  state = {
    stars: [],
    loading: true,
    refreshing: false,
    page: 1,
  };

  static propTypes = {
    route: PropTypes.shape({
      params: PropTypes.shape({
        user: PropTypes.shape({
          name: PropTypes.string,
          login: PropTypes.string,
          bio: PropTypes.string,
          avatar: PropTypes.string,
        }),
      }),
    }).isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  async componentDidMount() {
    this.load();
  }

  load = async (page = 1) => {
    const { route } = this.props;
    const { user } = route.params;
    const { stars } = this.state;

    const response = await api.get(`/users/${user.login}/starred`, {
      params: { page },
    });

    this.setState({
      loading: false,
      stars: page > 1 ? [...stars, ...response.data] : response.data,
      refreshing: false,
      page,
    });
  };

  loadMore = async () => {
    const { page } = this.state;

    const nextPage = page + 1;

    this.load(nextPage);
  };

  refreshList = async () => {
    this.setState({ stars: [], refreshing: true }, this.load);
  };

  render() {
    const { route, navigation } = this.props;
    const { user } = route.params;

    const { stars, loading, refreshing } = this.state;

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <ActivityIndicator color="#7159c1" size="large" />
        ) : (
          <Stars
            data={stars}
            KeyExtractor={star => String(star.id)}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            onRefresh={this.refreshList}
            refreshing={refreshing}
            renderItem={({ item }) => (
              <Starred
                onPress={() =>
                  navigation.navigate('Repository', { repository: item })
                }
              >
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
