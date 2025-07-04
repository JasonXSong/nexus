import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { updateKnowledgeBase } from '../../services/KnowledgeService';

const EditKnowledgeModal = ({ knowledge, visible, onClose, onUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (visible && knowledge) {
      form.setFieldsValue({
        name: knowledge.name,
        description: knowledge.description
      });
    }
  }, [visible, knowledge, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await updateKnowledgeBase(knowledge.id, values);
      message.success('知识库信息已更新');
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
      title="编辑知识库"
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
          label="知识库名称"
          rules={[{ required: true, message: '请输入知识库名称' }]}
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

export default EditKnowledgeModal;