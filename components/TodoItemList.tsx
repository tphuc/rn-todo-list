import React, { useContext, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, SectionList } from 'react-native';
// import { Card } from '@/interfaces/card';
// import CardPreview from './CardPreview';
import { Colors } from '@/constants/Colors';
// import { CardContext } from '@/contexts/CardContext';
import { ThemedText } from './ThemedText';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColor';
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemedButton } from '@/components/ThemedButton';
import { TodoItemsContext } from '@/contexts/TodoItemsContext';
import { TodoItem } from '@/interfaces/TodoItem';
import TodoItemCard from './TodoItemCard';
import { isToday } from '@/utils';

const ItemList: React.FC = () => {
  const { items, removeItem, addItem, updateItem } = useContext(TodoItemsContext);
  const { background, backgroundSecondary } = useThemeColors();
  const [loading, setLoading] = useState<boolean>(false)
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedTodoItem, setSelectedTodoItem] = useState<TodoItem | null>(null);

  const todayItems = items.filter(item => isToday(new Date(item.createdAt)));
  const handleItemPrress = (item: TodoItem) => {
    setSelectedTodoItem(item);
    bottomSheetRef.current?.present();
  };

  const handleRemoveCard = (id: string) => {
    removeItem(id);
    bottomSheetRef.current?.close();
  };

  const renderCard = ({ item }: { item: TodoItem }) => (
    <TouchableOpacity activeOpacity={0.88} style={{ marginVertical: 0, borderTopWidth:2, borderTopColor: backgroundSecondary }} >
      <TodoItemCard data={item} onRequestDelete={() => handleRemoveCard(item?.id)} onRequestUpdate={(item) => updateItem(item)} />
    </TouchableOpacity>
  );

  const handleAddItem = (text: string | undefined) => {
    if (text) {
      const newItem = {
        createdAt: new Date(),
        id: new Date().toISOString(),
        text,
      };

      addItem(newItem);
    }
  };

  const showPrompt = () => {
    Alert.prompt(
      'Add new item',
      '',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: (text) => handleAddItem(text),
        },
      ],
      'plain-text'
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 20 }}>
          <ThemedText type="title">Welcome!</ThemedText>

          <TouchableOpacity onPress={showPrompt} style={{ display: 'flex', flexDirection: 'row', backgroundColor: background, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center', gap: 2 }} activeOpacity={0.9}  >
            <Text style={{ fontSize: 20 }}>Add</Text>
            <Ionicons size={26} name="add" />
          </TouchableOpacity>

        </View>
      </View>
      <View style={styles.container}>
        <SectionList
          sections={[
            {
              title: 'Today',
              data: todayItems
            },
          ]}
          keyExtractor={(item, index) => `${item.id + index}`}
          renderItem={renderCard}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={{padding:20, fontSize:22}}>{title}</Text>
          )}
        />

      </View>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetRef}
          index={1}
          snapPoints={['15%', '20%']}
          onChange={() => { }}
        >
          <BottomSheetView style={styles.contentContainer}>
            <ThemedButton loading={loading} disabled={loading} variant="primary" title='Pay random amount' style={{ width: "100%" }} />
            <ThemedButton disabled={loading} variant="destructive" title='Remove card' style={{ width: "100%" }} onPress={() => handleRemoveCard(selectedTodoItem!.id)} />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>


    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: Colors.light.backgroundSecondary,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 40,
    paddingVertical: 10
  },
  option: {
    padding: 20,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
  },
});

export default ItemList;
