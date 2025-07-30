import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

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

function TodoList() {
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  const { data, loading, error, refetch } = useQuery(TodoS_QUERY);
  const [createTodo] = useMutation(CREATE_Todo_MUTATION);
  const [updateTodo] = useMutation(UPDATE_Todo_MUTATION);
  const [deleteTodo] = useMutation(DELETE_Todo_MUTATION);

  const handleCreateTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      await createTodo({
        variables: { title: newTodo },
        refetchQueries: [{ query: TodoS_QUERY }]
      });
      setNewTodo('');
    } catch (err) {
      console.error('Error creating Todo:', err);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      await updateTodo({
        variables: { id, completed: !completed }
      });
      refetch();
    } catch (err) {
      console.error('Error updating Todo:', err);
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
      console.error('Error updating Todo:', err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo({
        variables: { id },
        refetchQueries: [{ query: TodoS_QUERY }]
      });
    } catch (err) {
      console.error('Error deleting Todo:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-ping"></div>
            <div className="absolute inset-2 border-4 border-blue-400 rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-4 border-blue-600 rounded-full animate-pulse"></div>
          </div>
          <p className="text-gray-700 text-lg font-medium animate-pulse">Loading your todos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center text-red-600">
            <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold mb-1">Oops! Something went wrong</h3>
              <p className="text-sm opacity-80">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const completedCount = data?.Todos?.filter(Todo => Todo.completed).length || 0;
  const totalCount = data?.Todos?.length || 0;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-100/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-100/40 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E5E7EB' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              My Tasks
            </h1>
            <p className="text-gray-600 text-lg mb-6">Stay organized and productive</p>
            
            {/* Progress Bar */}
            {totalCount > 0 && (
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{completedCount} completed</span>
                  <span>{totalCount} total</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out shadow-sm"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{Math.round(progressPercentage)}% complete</p>
              </div>
            )}
          </div>

          {/* Add Todo Form */}
          <div className="mb-8">
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-6 transition-all duration-500 hover:shadow-blue-100">
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-300 ${inputFocused ? 'opacity-20' : ''}`}></div>
                <div className="relative flex">
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="What would you like to accomplish?"
                    className="flex-1 px-6 py-4 bg-gray-50/50 border border-gray-200 rounded-l-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-300 text-lg"
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateTodo(e)}
                  />
                  <button
                    onClick={handleCreateTodo}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-r-2xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transform hover:scale-105 transition-all duration-300 shadow-xl"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Todo List */}
          <div className="space-y-4">
            {data?.Todos?.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-32 h-32 mx-auto mb-6 opacity-30">
                  <svg className="w-full h-full text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-500 text-xl mb-2">No tasks yet</p>
                <p className="text-gray-400">Add your first task above to get started!</p>
              </div>
            ) : (
              data?.Todos?.map((Todo, index) => (
                <div 
                  key={Todo.id} 
                  className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl hover:shadow-blue-100 transition-all duration-300 transform hover:scale-[1.02] animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Custom Checkbox */}
                      <label className="relative flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Todo.completed}
                          onChange={() => handleToggleComplete(Todo.id, Todo.completed)}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          Todo.completed 
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 border-green-400 shadow-lg shadow-green-200' 
                            : 'border-gray-300 hover:border-blue-400 bg-white'
                        }`}>
                          {Todo.completed && (
                            <svg className="w-4 h-4 text-white animate-scale-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </label>

                      {editingId === Todo.id ? (
                        <div className="flex-1 flex items-center space-x-3">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                            onKeyPress={(e) => e.key === 'Enter' && handleUpdateTitle(Todo.id)}
                            autoFocus
                          />
                          <button
                            onClick={() => handleUpdateTitle(Todo.id)}
                            className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl hover:from-green-500 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditingTitle('');
                            }}
                            className="px-4 py-2 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition-all duration-300 transform hover:scale-105"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className={`flex-1 text-lg transition-all duration-300 ${
                            Todo.completed 
                              ? 'line-through text-gray-400 opacity-60' 
                              : 'text-gray-800'
                          }`}>
                            {Todo.title}
                          </span>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setEditingId(Todo.id);
                                setEditingTitle(Todo.title);
                              }}
                              className="p-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl hover:from-amber-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteTodo(Todo.id)}
                              className="p-2 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-xl hover:from-red-500 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Todo metadata */}
                    <div className="mt-3 text-xs text-gray-500 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Created {new Date(Todo.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Stats */}
          {totalCount > 0 && (
            <div className="mt-12 text-center">
              <div className="inline-flex items-center space-x-6 px-6 py-3 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{totalCount}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{completedCount}</div>
                  <div className="text-xs text-gray-500">Done</div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{totalCount - completedCount}</div>
                  <div className="text-xs text-gray-500">Pending</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default TodoList;