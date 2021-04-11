import * as React from 'react';
import { StyleSheet } from 'react-native';

import ProjectItem from '../components/ProjectItem';
import { View } from '../components/Themed';

export default function TabTwoScreen() {
  const project = {
    id: '1',
    title: 'first Project',
    time: new Date().toISOString(),
  };

  return (
    <View style={styles.container}>
      {/* Project List */}
      <ProjectItem project={project} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
