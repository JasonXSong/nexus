import React, { useState } from 'react';
import { Modal, Form, Input, Button, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { createKnowledgeBase } from '../../services/KnowledgeService';
import { UploadKnowledgeFile } from './UploadKnowledgeFile';

const CreateKnowledge = ({ visible, onClose, onCreate }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 创建FormData对象用于文件上传
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('chunking_mode', values.chunking_mode)
      
      const response = await createKnowledgeBase(formData);

      if (fileList.length > 0) {
        const knowledgeId = response.id;
        const formDataFile = new FormData();
        fileList.forEach(file => {
          formDataFile.append('files', file.originFileObj);
        });
        //const files = fileList.map(file => file.originFileObj);
        //await uploadFiles(response.id, formData); // 传递原始文件数组
        try {
          // 显示上传中状态
          setFileList(fileList.map(file => ({
            ...file,
            status: 'uploading',
            percent: 0
          })));
    
          const response = await fetch('http://localhost:8000/api/v1/knowledge/'+knowledgeId+'/files', {
            method: 'POST',
            body: formDataFile,
          });
    
          if (!response.ok) {
            throw new Error(`上传失败: ${response.status}`);
          }
    
          const result = await response.json();
          
          // 更新文件状态为完成
          setFileList(fileList.map(file => ({
            ...file,
            status: 'done',
            percent: 100
          })));
    
          message.success(`${fileList.length} 个文件上传成功！`);
          
          // 清空文件列表
          setFileList([]);
        } catch (error) {
          console.error('上传错误:', error);
          
          // 更新文件状态为错误
          setFileList(fileList.map(file => ({
            ...file,
            status: 'error'
          })));
          
          message.error('文件上传失败');
        }

        // 创建chunk
        try {
          const response = await fetch('http://localhost:8000/api/v1/knowledge/'+knowledgeId+'/chunks', {
            method: 'POST'
          });
    
          if (!response.ok) {
            throw new Error(`chunk建立失败: ${response.status}`);
          }
    
          const result = await response.json();
    
          message.success(`chunks创建成功！`);
          
        } catch (error) {
          console.error('chunks创建错误:', error);
        }
      }

      message.success('知识库创建成功');
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
      title="新建知识库"
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
          label="知识库名称"
          rules={[{ required: true, message: '请输入知识库名称' }]}
        >
          <Input placeholder="例如: 产品手册" />
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: '请输入描述信息' }]}
        >
          <Input.TextArea placeholder="描述知识库的主要内容" />
        </Form.Item>

        <Form.Item
          name="chunking_mode"
          label="切片模式"
          rules={[{ required: true, message: '请选择切片模式' }]}
        >
          <Select defaultValue="A" placeholder="请选择切片模式">
            <Select.Option value="A">A</Select.Option>
            <Select.Option value="B">B</Select.Option>
            <Select.Option value="C">C</Select.Option>
            <Select.Option value="D">D</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          label="上传文件"
        >
          <Upload
            fileList={fileList}
            onChange={handleUpload}
            beforeUpload={() => false} // 阻止自动上传
            multiple
          >
            <Button icon={<UploadOutlined />}>选择文件</Button>
          </Upload>
          <div className="text-gray-500 text-xs mt-2">
            支持 PDF, DOCX, TXT 等格式
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateKnowledge;