import React, { useState } from 'react';
import { Card, Tag, Popconfirm, Button, message, Space, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, RobotOutlined } from '@ant-design/icons';
import { deleteChatBot } from '../../services/ChatBotService';
import EditChatBotModal from './EditChatBotModal';

const { Text } = Typography;

const ChatBotCard = ({ bot, refresh }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteChatBot(bot.id);
      message.success('机器人已删除');
      refresh();
    } catch (error) {
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        hoverable
        className="h-full"
        actions={[
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => setEditModalVisible(true)}
          >
            编辑
          </Button>,
          <Popconfirm
            title="确定要删除此机器人吗?"
            onConfirm={handleDelete}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              loading={loading}
            >
              删除
            </Button>
          </Popconfirm>
        ]}
      >
        <div className="flex items-start mb-3">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <RobotOutlined className="text-blue-600 text-lg" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base mb-1">{bot.name}</h3>
            <Text type="secondary" className="text-xs">
              创建于 {bot.createdAt}
            </Text>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {bot.description || '暂无描述信息'}
        </p>
        
        <div className="flex justify-between items-center">
          <Tag color="blue">对话机器人</Tag>
          <Space>
            <Tag color="green">已启用</Tag>
          </Space>
        </div>
      </Card>
      
      <EditChatBotModal
        bot={bot}
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onUpdate={refresh}
      />
    </>
  );
};

export default ChatBotCard;