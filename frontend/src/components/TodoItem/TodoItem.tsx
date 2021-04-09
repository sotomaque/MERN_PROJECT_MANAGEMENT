import React, { useEffect, useRef, useState } from 'react';
import { TextInputKeyPressEventData } from 'react-native';
import { NativeSyntheticEvent } from 'react-native';
import { View, StyleSheet, TextInput } from 'react-native';
import Checkbox from '../Checkbox';

type Todo = {
  id: string;
  content: string;
  isCompleted: boolean;
};

interface TodoProps {
  todo: Todo;
  onSubmit: () => void;
}

const TodoItem = ({ todo, onSubmit }: TodoProps) => {
  const [isChecked, setIsChecked] = useState(todo.isCompleted);
  const [content, setContent] = useState(todo.content);
  const input = useRef(null);
  const handleSubmit = () => {
    // add new todo object within
    onSubmit();
  };

  useEffect(() => {
    // set focus on input
    if (input.current) {
      input?.current?.focus();
    }
  }, [input]);

  const handleKeyPress = ({
    nativeEvent,
  }: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (nativeEvent.key === 'Backspace' && content === '') {
      // delete item from list
      console.warn('delete item');
    }
  };

  return (
    <View style={styles.task}>
      {/* Checkbox */}
      <Checkbox
        isChecked={isChecked}
        onPress={() => setIsChecked((prev) => !prev)}
      />

      {/* Text Input */}
      <TextInput
        ref={input}
        blurOnSubmit
        multiline
        onChangeText={(text) => setContent(text)}
        onSubmitEditing={handleSubmit}
        placeholder="Enter a task"
        placeholderTextColor="#444"
        style={styles.textInput}
        value={content}
        onKeyPress={(nativeEvent) => handleKeyPress(nativeEvent)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
});

export default TodoItem;
