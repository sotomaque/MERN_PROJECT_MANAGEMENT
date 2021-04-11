import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

type Project = {
  id: string;
  title: string;
  time: string;
};

type ProjectItemProps = {
  project: Project;
};

const ProjectItem = ({ project }: ProjectItemProps) => {
  return (
    <View style={styles.project}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="file-outline" size={24} color="white" />
      </View>
      <View>
        <Text style={styles.title}>{project.title}</Text>
        <Text style={styles.time}>
          {formatDistanceToNow(new Date(project.time))}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  project: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    padding: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#404040',
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    color: 'white',
  },
  time: {
    color: 'darkgrey',
  },
});

export default ProjectItem;
