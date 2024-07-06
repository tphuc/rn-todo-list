import { TodoItem } from '@/interfaces/TodoItem';
import React, { useState } from 'react';
import { Animated, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const TodoItemCard = ({ data, onRequestDelete, onRequestUpdate }: { data: TodoItem, onRequestDelete?: () => void, onRequestUpdate?: (updatedItem: TodoItem) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.text);

  const handleBlur = () => {
    setIsEditing(false);
    if (text !== data.text) {
      onRequestUpdate?.({ ...data, text });
    }
  };

  const renderRightActions = (progress: any, dragX: any) => {
    const trans = dragX.interpolate({
      inputRange: [-100, -50, 0, 1],
      outputRange: [0, 0, -20, -20],
    });
    return (
      <RectButton style={styles.rightAction}>
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          Remove
        </Animated.Text>
      </RectButton>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      onSwipeableOpen={() => {
        onRequestDelete?.();
      }}
    >
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => setIsEditing(true)}
        activeOpacity={1}
      >
        {isEditing ? (
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={setText}
            onBlur={handleBlur}
            autoFocus
          />
        ) : (
          <Text>{data.text}</Text>
        )}
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  textInput: {
    borderColor: 'gray',
  },
  rightAction: {
    flex: 1,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
});

export default TodoItemCard;
