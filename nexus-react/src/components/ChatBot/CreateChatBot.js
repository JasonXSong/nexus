import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { createChatBot } from '../../services/ChatBotService';

const CreateChatBot = ({ visible, onClose, onCreate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await createChatBot(values);
      message.success('聊天机器人创建成功');
      form.resetFields();
      onClose();
      onCreate();
    } catch (error) {
      console.error('创建失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="创建聊天机器人"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button 
          key="create" 
          type="primary" 
          loading={loading}
          onClick={handleSubmit}
        >
          创建
        </Button>
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="机器人名称"
          rules={[{ required: true, message: '请输入机器人名称' }]}
        >
          <Input placeholder="例如: 客服助手" />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: '请输入描述信息' }]}
        >
          <Input.TextArea placeholder="描述机器人的主要功能" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateChatBot;