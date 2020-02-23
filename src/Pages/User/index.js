import React, { Component } from 'react';
import { ActivityIndicator, Button } from 'react-native';
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
    loading: false,
    page: 1,
    refreshing: false,
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
    const { route } = this.props;
    const { user } = route.params;

    this.setState({ loading: true });

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({ stars: response.data, loading: false });
  }

  loadMore = async () => {
    const { route } = this.props;
    const { user } = route.params;
    const { page, stars } = this.state;

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page: page + 1,
      },
    });

    if (response.data) {
      this.setState({ page: page + 1, stars: [...stars, ...response.data] });
    }
  };

  refreshList = async () => {
    const { route } = this.props;
    const { user } = route.params;

    this.setState({ refreshing: true });

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({ stars: response.data, refreshing: false });
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
