import api from './api';

const chatService = {
  getChatList: async () => {
    const response = await api.get('/chat-list');
    return response.data;
  },

  getChatView: async (id: string | number) => {
    const response = await api.get(`/chat-view/${id}`);
    return response.data;
  },

  sendMessage: async (chat_thread_id: string | number, message: string) => {
    const response = await api.post('/chat-reply', {
      chat_thread_id,
      message
    });
    return response.data;
  }
};

export default chatService;
