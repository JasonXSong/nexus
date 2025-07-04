import React, { useState } from 'react';
import { Card, Tag, Popconfirm, Button, message, Typography, Space } from 'antd';
import { EditOutlined, DeleteOutlined, FileTextOutlined, ExperimentOutlined } from '@ant-design/icons';
import { deleteKnowledgeBase } from '../../services/KnowledgeService';
import EditKnowledgeModal from './EditKnowledgeModal';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const KnowledgeCard = ({ knowledge, refresh }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteKnowledgeBase(knowledge.id);
      message.success('知识库已删除');
      refresh();
    } catch (error) {
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  };

  const handleTest = () => {
    navigate('/knowledge/' + knowledge.id + '/test');
  }

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
          <Button 
            key="test" // 新增测试按钮
            type="text" 
            icon={<ExperimentOutlined />}
            onClick={handleTest}
          >
            测试
          </Button>,
          <Popconfirm
            title="确定要删除此知识库吗?"
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
          <div className="bg-purple-100 p-2 rounded-full mr-3">
            <FileTextOutlined className="text-purple-600 text-lg" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base mb-1">{knowledge.name}</h3>
            <Text type="secondary" className="text-xs">
              最近更新于 {knowledge.updatedAt}
            </Text>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {knowledge.description || '暂无描述信息'}
        </p>
        
        <div className="flex justify-between items-center">
          <Tag color="purple">切片模式：{knowledge.chunkingMode}</Tag>
          <Space>
            <Tag color="blue">{knowledge.documents_?.length || 0} 个文件</Tag>
            <Tag color="green">已启用</Tag>
          </Space>
        </div>
      </Card>
      
      <EditKnowledgeModal
        knowledge={knowledge}
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onUpdate={refresh}
      />
    </>
  );
};

export default KnowledgeCard;