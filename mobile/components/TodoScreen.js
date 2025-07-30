import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useQuery, useMutation, gql } from '@apollo/client';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
    }
  }
`;

const TodoS_QUERY = gql`
  query Todos {
    Todos {
      id
      title
      completed
      createdAt
    }
  }
`;

const CREATE_Todo_MUTATION = gql`
  mutation CreateTodo($title: String!) {
    createTodo(title: $title) {
      id
      title
      completed
      createdAt
    }
  }
`;

const UPDATE_Todo_MUTATION = gql`
  mutation UpdateTodo($id: ID!, $title: String, $completed: Boolean) {
    updateTodo(id: $id, title: $title, completed: $completed) {
      id
      title
      completed
    }
  }
`;

const DELETE_Todo_MUTATION = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;

// Custom Icons
const TaskIcon = ({ size = 24, color = "#ffffff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const CheckIcon = ({ size = 16, color = "#ffffff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M5 13l4 4L19 7" 
      stroke={color} 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const PlusIcon = ({ size = 24, color = "#ffffff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const EditIcon = ({ size = 16, color = "#ffffff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const DeleteIcon = ({ size = 16, color = "#ffffff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const CloseIcon = ({ size = 16, color = "#ffffff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M6 18L18 6M6 6l12 12" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const ClockIcon = ({ size = 12, color = "#9ca3af" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const LogoutIcon = ({ size = 16, color = "#ffffff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const UserIcon = ({ size = 16, color = "#ffffff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

export default function TodoScreen({ onLogout }) {
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  // Fetch user data
  const { data: userData, loading: userLoading, error: userError } = useQuery(ME_QUERY, {
    errorPolicy: 'ignore'
  });

  const { data, loading, error, refetch } = useQuery(TodoS_QUERY);
  const [createTodo] = useMutation(CREATE_Todo_MUTATION);
  const [updateTodo] = useMutation(UPDATE_Todo_MUTATION);
  const [deleteTodo] = useMutation(DELETE_Todo_MUTATION);

  const handleCreateTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      await createTodo({
        variables: { title: newTodo },
        refetchQueries: [{ query: TodoS_QUERY }]
      });
      setNewTodo('');
    } catch (err) {
      Alert.alert('Error', 'Failed to create task');
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      await updateTodo({
        variables: { id, completed: !completed }
      });
      refetch();
    } catch (err) {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleUpdateTitle = async (id) => {
    if (!editingTitle.trim()) return;

    try {
      await updateTodo({
        variables: { id, title: editingTitle }
      });
      setEditingId(null);
      setEditingTitle('');
      refetch();
    } catch (err) {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleDeleteTodo = async (id) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTodo({
                variables: { id },
                refetchQueries: [{ query: TodoS_QUERY }]
              });
            } catch (err) {
              Alert.alert('Error', 'Failed to delete task');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <LinearGradient
          colors={['#f8fafc', '#ffffff', '#dbeafe']}
          style={styles.gradient}
        >
          <View style={styles.loadingContainer}>
            <View style={styles.loadingCard}>
              <View style={styles.loadingSpinner}>
                <ActivityIndicator size="large" color="#3b82f6" />
              </View>
              <Text style={styles.loadingText}>Loading your tasks...</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <LinearGradient
          colors={['#f8fafc', '#ffffff', '#dbeafe']}
          style={styles.gradient}
        >
          <View style={styles.errorContainer}>
            <View style={styles.errorCard}>
              <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
              <Text style={styles.errorMessage}>{error.message}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  const completedCount = data?.Todos?.filter(todo => todo.completed).length || 0;
  const totalCount = data?.Todos?.length || 0;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const renderTodoItem = ({ item, index }) => (
    <Animated.View 
      style={[
        styles.todoItem,
        { 
          opacity: 1,
          transform: [{ translateY: 0 }]
        }
      ]}
    >
      <View style={styles.todoContent}>
        {/* Checkbox */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => handleToggleComplete(item.id, item.completed)}
        >
          <View style={[
            styles.checkbox,
            item.completed && styles.checkboxCompleted
          ]}>
            {item.completed && <CheckIcon size={12} color="#ffffff" />}
          </View>
        </TouchableOpacity>

        {editingId === item.id ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.editInput}
              value={editingTitle}
              onChangeText={setEditingTitle}
              onSubmitEditing={() => handleUpdateTitle(item.id)}
              autoFocus
              placeholder="Edit task..."
              placeholderTextColor="#9ca3af"
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => handleUpdateTitle(item.id)}
            >
              <CheckIcon size={14} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setEditingId(null);
                setEditingTitle('');
              }}
            >
              <CloseIcon size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.todoTextContainer}>
              <Text style={[
                styles.todoTitle,
                item.completed && styles.todoTitleCompleted
              ]}>
                {item.title}
              </Text>
              <View style={styles.todoMeta}>
                <ClockIcon size={10} color="#9ca3af" />
                <Text style={styles.todoDate}>
                  Created {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setEditingId(item.id);
                  setEditingTitle(item.title);
                }}
              >
                <EditIcon size={14} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTodo(item.id)}
              >
                <DeleteIcon size={14} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </Animated.View>
  );

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <TaskIcon size={64} color="#d1d5db" />
      </View>
      <Text style={styles.emptyTitle}>No tasks yet</Text>
      <Text style={styles.emptySubtitle}>Add your first task above to get started!</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <LinearGradient
        colors={['#f8fafc', '#ffffff', '#dbeafe']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.headerLogo}>
                <LinearGradient
                  colors={['#3b82f6', '#8b5cf6']}
                  style={styles.logoGradient}
                >
                  <TaskIcon size={20} color="#ffffff" />
                </LinearGradient>
              </View>
              <Text style={styles.headerTitle}>TaskFlow</Text>
            </View>
            
            <View style={styles.headerRight}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <LinearGradient
                    colors={['#22c55e', '#10b981']}
                    style={styles.avatarGradient}
                  >
                    <UserIcon size={12} color="#ffffff" />
                  </LinearGradient>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.welcomeText}>Welcome back</Text>
                  <Text style={styles.userEmail}>
                    {userData?.me?.email || 'Loading...'}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                <LinearGradient
                  colors={['#ef4444', '#ec4899']}
                  style={styles.logoutGradient}
                >
                  <LogoutIcon size={14} color="#ffffff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.main}>
          {/* Header Section with Stats */}
          <View style={styles.statsSection}>
            <View style={styles.statsLogo}>
              <LinearGradient
                colors={['#3b82f6', '#8b5cf6']}
                style={styles.statsLogoGradient}
              >
                <TaskIcon size={32} color="#ffffff" />
              </LinearGradient>
            </View>
            <Text style={styles.statsTitle}>My Tasks</Text>
            <Text style={styles.statsSubtitle}>Stay organized and productive</Text>
            
            {/* Progress Bar */}
            {totalCount > 0 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressLabel}>{completedCount} completed</Text>
                  <Text style={styles.progressLabel}>{totalCount} total</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
                </View>
                <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}% complete</Text>
              </View>
            )}
          </View>

          {/* Add Todo Form */}
          <View style={styles.formContainer}>
            <View style={[
              styles.formCard,
              inputFocused && styles.formCardFocused
            ]}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={newTodo}
                  onChangeText={setNewTodo}
                  placeholder="What would you like to accomplish?"
                  placeholderTextColor="#9ca3af"
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  onSubmitEditing={handleCreateTodo}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleCreateTodo}>
                  <LinearGradient
                    colors={['#3b82f6', '#8b5cf6']}
                    style={styles.addButtonGradient}
                  >
                    <PlusIcon size={20} color="#ffffff" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Todo List */}
          <View style={styles.listContainer}>
            <FlatList
              data={data?.Todos || []}
              keyExtractor={(item) => item.id}
              renderItem={renderTodoItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={EmptyComponent}
            />
          </View>

          {/* Footer Stats */}
          {totalCount > 0 && (
            <View style={styles.footerStats}>
              <View style={styles.statsCard}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{totalCount}</Text>
                  <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: '#22c55e' }]}>{completedCount}</Text>
                  <Text style={styles.statLabel}>Done</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: '#3b82f6' }]}>{totalCount - completedCount}</Text>
                  <Text style={styles.statLabel}>Pending</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  loadingSpinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorCard: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#dc2626',
    opacity: 0.8,
    textAlign: 'center',
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    marginRight: 12,
  },
  logoGradient: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatar: {
    marginRight: 8,
  },
  avatarGradient: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    alignItems: 'flex-end',
  },
  welcomeText: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '500',
  },
  userEmail: {
    fontSize: 8,
    color: '#9ca3af',
  },
  logoutButton: {
    borderRadius: 8,
  },
  logoutGradient: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  statsLogo: {
    marginBottom: 16,
  },
  statsLogoGradient: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  statsTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  statsSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  progressContainer: {
    width: '100%',
    maxWidth: 280,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  formCardFocused: {
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(249, 250, 251, 0.8)',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  addButton: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  addButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  todoItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  editContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1f2937',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    padding: 8,
    marginRight: 4,
  },
  cancelButton: {
    backgroundColor: '#6b7280',
    borderRadius: 8,
    padding: 8,
  },
  todoTextContainer: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 4,
  },
  todoTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
    opacity: 0.6,
  },
  todoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todoDate: {
    fontSize: 10,
    color: '#9ca3af',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    opacity: 0.3,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    color: '#9ca3af',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#d1d5db',
    textAlign: 'center',
  },
  footerStats: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e5e7eb',
  },
});