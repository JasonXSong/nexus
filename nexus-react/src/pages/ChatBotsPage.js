import React, { useState, useEffect } from 'react';
import { Button, Row, Col } from 'antd';
import ChatBotList from '../components/ChatBot/ChatBotList';
import CreateChatBot from '../components/ChatBot/CreateChatBot';
import { fetchChatBots } from '../services/ChatBotService';

const ChatBotsPage = () => {
  const [bots, setBots] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadBots = async () => {
    const data = await fetchChatBots();
    setBots(data);
  };

  useEffect(() => {
    loadBots();
  }, []);

  return (
    <div className="p-6">
      <Row justify="space-between" align="middle" className="mb-6">
        <Col>
          <h1 className="text-2xl font-bold">聊天机器人管理</h1>
        </Col>
        <Col>
          <Button 
            type="primary" 
            onClick={() => setShowCreateModal(true)}
          >
            创建机器人
          </Button>
        </Col>
      </Row>
      
      <ChatBotList bots={bots} refresh={loadBots} />
      
      <CreateChatBot 
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={loadBots}
      />
    </div>
  );
};

export default ChatBotsPage;