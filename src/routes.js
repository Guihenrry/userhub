import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Main from './Pages/Main';
import User from './Pages/User';
import Repository from './Pages/Repository';

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#7159c1',
          },
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          options={{
            title: 'Usuários',
          }}
          name="Main"
          component={Main}
        />
        <Stack.Screen
          name="User"
          component={User}
          options={({ route }) => ({ title: route.params.user.name })}
        />
        <Stack.Screen
          name="Repository"
          component={Repository}
          options={({ route }) => ({
            title: route.params.repository.full_name,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
