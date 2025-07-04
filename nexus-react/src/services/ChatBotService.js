// 模拟数据
let chatBots = [
  { id: '1', name: '客服助手', description: '处理客户咨询', createdAt: '2023-05-15' },
  { id: '2', name: '技术支持', description: '解决技术问题', createdAt: '2023-06-10' }
];

export const fetchChatBots = async () => {
  // 模拟API请求延迟
  return new Promise(resolve => {
    setTimeout(() => resolve([...chatBots]), 500);
  });
};

export const createChatBot = async (data) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newBot = {
        id: `bot-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString().split('T')[0]
      };
      chatBots.push(newBot);
      resolve(newBot);
    }, 500);
  });
};

export const deleteChatBot = async (id) => {
  return new Promise(resolve => {
    setTimeout(() => {
      chatBots = chatBots.filter(bot => bot.id !== id);
      resolve();
    }, 500);
  });
};

export const updateChatBot = async (id, data) => {
  return new Promise(resolve => {
    setTimeout(() => {
      chatBots = chatBots.map(bot => 
        bot.id === id ? { ...bot, ...data } : bot
      );
      resolve();
    }, 500);
  });
};