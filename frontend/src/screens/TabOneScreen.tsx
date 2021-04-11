import { useHeaderHeight } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import TodoItem from '../components/TodoItem';

export default function TabOneScreen() {
  const headerHeight = useHeaderHeight();
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState([
    {
      id: '1',
      content: 'wake up',
      isCompleted: false,
    },
    {
      id: '2',
      content: 'wake up again',
      isCompleted: false,
    },
    {
      id: '3',
      content: 'go on a walk',
      isCompleted: false,
    },
  ]);

  const createNewItem = (index: number) => {
    const newTodos = [...todos];
    newTodos.splice(index, 0, {
      id: `${index}`,
      content: '',
      isCompleted: false,
    });
    setTodos(newTodos);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight + 100}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          onChangeText={(text) => setTitle(text)}
          placeholder="Title"
          placeholderTextColor="#444"
          style={styles.title}
          value={title}
        />
        <FlatList
          data={todos}
          renderItem={({ item, index }) => (
            <TodoItem todo={item} onSubmit={() => createNewItem(index + 1)} />
          )}
          style={{ width: '100%' }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  title: {
    width: '100%',
    textAlign: 'center',
    fontSize: 22,
    marginVertical: 10,
  },
});
