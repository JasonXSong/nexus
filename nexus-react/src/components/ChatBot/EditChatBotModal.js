import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { updateChatBot } from '../../services/ChatBotService';

const EditChatBotModal = ({ bot, visible, onClose, onUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (visible && bot) {
      form.setFieldsValue({
        name: bot.name,
        description: bot.description
      });
    }
  }, [visible, bot, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await updateChatBot(bot.id, values);
      message.success('机器人信息已更新');
      onClose();
      onUpdate();
    } catch (error) {
      console.error('更新失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="编辑机器人"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button 
          key="save" 
          type="primary" 
          loading={loading}
          onClick={handleSubmit}
        >
          保存
        </Button>
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="机器人名称"
          rules={[{ required: true, message: '请输入机器人名称' }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: '请输入描述信息' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditChatBotModal;