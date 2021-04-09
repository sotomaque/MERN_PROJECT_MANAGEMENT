import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CheckboxProps {
  isChecked: boolean;
  onPress: React.Dispatch<React.SetStateAction<boolean>>;
  style?: any;
}

const Checkbox = ({ isChecked, onPress, style }: CheckboxProps) => {
  const name = isChecked ? 'checkbox-marked-outline' : 'checkbox-blank-outline';
  return (
    <Pressable style={styles.container} onPress={onPress} {...style}>
      <MaterialCommunityIcons name={name} size={24} color="white" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 12,
  },
});

export default Checkbox;
