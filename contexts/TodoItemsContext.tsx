import React, { createContext, useState, useEffect, ReactElement } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TodoItem } from '../interfaces/TodoItem';

export interface TodoItemsContextType {
  items: TodoItem[];
  addItem: (item: TodoItem) => void;
  removeItem: (itemId: string) => void;
  updateItem: (item: TodoItem) => void;
  loadItems: () => void;
}

const initialState = {
  items: [],
};

const TodoItemsContext = createContext<TodoItemsContextType>({
  ...initialState,
  addItem: () => {},
  removeItem: () => {},
  updateItem: () => {},
  loadItems: () => {},
});

interface ProviderProps {
  children: ReactElement;
}

function TodoItemProvider({ children }: ProviderProps) {
  const [items, setItems] = useState<TodoItem[]>(initialState.items);

  const addItem = async (item: TodoItem) => {
    try {
      const updatedItems = [...items, item];
      setItems(updatedItems);
      await AsyncStorage.setItem('items', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
      await AsyncStorage.setItem('items', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const updateItem = async (updatedItem: TodoItem) => {
    try {
      const updatedItems = items.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      );
      setItems(updatedItems);
      await AsyncStorage.setItem('items', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const loadItems = async () => {
    try {
      const storedItems = await AsyncStorage.getItem('items');
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <TodoItemsContext.Provider value={{ items, addItem, removeItem, updateItem, loadItems }}>
      {children}
    </TodoItemsContext.Provider>
  );
}

export { TodoItemsContext, TodoItemProvider };
