import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, List, Card, Row, Col, Typography, Spin, Alert, Statistic } from 'antd';
import { SendOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';

const { Text } = Typography;

const KnowledgeTestPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [references, setReferences] = useState([]);
  const [refLoading, setRefLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [referenceTime, setReferenceTime] = useState(0);
  const [replyTime, setReplyTime] = useState(0);
  const messagesEndRef = useRef(null);
  const { knowledge_id } = useParams();

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 模拟获取参考文献API
  const fetchReferences = async (message) => {
    const startTime = Date.now();
    
    try {
      const response = await fetch(
        'http://localhost:8000/api/v1/knowledge/' + knowledge_id + '/chunks?top_n=3',
        {
          method: 'GET'
        }
      );

      if (!response.ok) {
        throw new Error(`chunk查询失败: ${response.status}`);
      }

      const result = await response.json();
      //message.success(`chunks查询成功！`);

      return result?.data?.chunks || result?.chunks || [];
    } catch (error) {
      console.error('chunks查询错误:', error);
    }
    
    // 模拟参考文献数据
    return [];
  };

  // 模拟生成回复API
  const fetchResponse = async (message, content) => {
    const startTime = Date.now();
    
    const formData = new FormData();
    formData.append('query', message);
    formData.append('documents', content);
    try {
      const response = await fetch(
        'http://localhost:8000/api/v1/knowledge/' + knowledge_id + '/test_chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',  // 必须声明JSON格式
          },
          body: JSON.stringify({
            'query': message,
            'documents': content
          })
        }
      );

      if (!response.ok) {
        throw new Error(`调用chat模型失败: ${response.status}`);
      }
    
      const result = await response.json();
      return result?.answer;
    } catch (error) {
      console.error('chat模型调用错误:', error);
    }

    return '未知错误……';
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // 添加用户消息
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    try {
      // 第一步：获取参考文献
      setRefLoading(true);
      const refStart = Date.now();
      const refs = await fetchReferences(inputValue);
      const refEnd = Date.now();
      const refTime = (refEnd - refStart) / 1000;
      
      setReferences(refs);
      setReferenceTime(refTime);
      setRefLoading(false);
      
      // 第二步：生成回复
      setReplyLoading(true);
      const replyStart = Date.now();
      
      // 显示加载中的AI消息
      const tempAiMessage = {
        id: 'temp-' + Date.now(),
        text: '思考中...',
        sender: 'ai',
        loading: true,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, tempAiMessage]);
      
      const refs_content = refs.map(item => item.content);
      const response = await fetchResponse(inputValue, refs_content);
      const replyEnd = Date.now();
      const replyTime = (replyEnd - replyStart) / 1000;
      
      // 移除临时消息，添加真实响应
      setMessages(prev => prev.filter(msg => msg.id !== tempAiMessage.id));
      
      const aiMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'ai',
        replyTime,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setReplyTime(replyTime);
    } catch (error) {
      setMessages(prev => prev.filter(msg => msg.id !== 'temp-' + Date.now()));
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: '抱歉，处理您的请求时出错',
        sender: 'ai',
        error: true,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setReplyLoading(false);
      setRefLoading(false);
    }
  };

  // 在组件外部定义的辅助函数
  const renderTextWithThink = (text) => {
    if (!text) return null;
    
    // 正则表达式匹配 <think> 标签及其内容
    const parts = text.split(/(<think>[\s\S]*?<\/think>)/g);
    console.log(parts);
    
    return parts.map((part, index) => {
      if (part.startsWith('<think>') && part.endsWith('</think>')) {
        // 提取 <think> 标签内的内容并应用灰色样式
        const content = part.replace(/<think>|<\/think>/g, '');
        return (
          <span key={index} style={{ color: '#888', fontStyle: 'italic' }}>
            {content}
          </span>
        );
      }
      // 普通文本部分保持原样
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="p-6">
      <Row gutter={16}>
        {/* 左侧聊天区域 */}
        <Col span={16}>
          <Card 
            title="智能对话" 
            bordered={false} 
            className="mb-6"
          >
            <div 
              style={{ 
                height: '60vh', 
                overflowY: 'auto', 
                padding: '10px',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px'
              }}
            >
              <List
                itemLayout="horizontal"
                dataSource={messages}
                renderItem={item => (
                  <List.Item 
                    style={{ 
                      justifyContent: item.sender === 'user' ? 'flex-end' : 'flex-start' 
                    }}
                  >
                    <div 
                      className={`message ${item.sender}`}
                      style={{
                        maxWidth: '80%',
                        padding: '10px 15px',
                        borderRadius: '18px',
                        background: item.sender === 'user' ? '#e6f7ff' : '#f0f0f0',
                        marginBottom: '10px',
                        position: 'relative'
                      }}
                    >
                      {item.loading ? (
                        <div className="flex items-center">
                          <Spin size="small" className="mr-2" />
                          <span>思考中...</span>
                        </div>
                      ) : (
                        <>
                          <div style={{ whiteSpace: 'pre-wrap' }}>
                            {renderTextWithThink(item.text)}
                          </div>
                          <div style={{ fontSize: '0.75em', marginTop: '5px' }}>
                            <Text type="secondary">{item.timestamp}</Text>
                            {item.sender === 'ai' && !item.error && item.replyTime && (
                              <Text type="secondary" style={{ marginLeft: '10px' }}>
                                <ClockCircleOutlined /> {item.replyTime.toFixed(2)}秒
                              </Text>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </List.Item>
                )}
              />
              <div ref={messagesEndRef} />
            </div>
            
            <div className="mt-4">
              <Input.Group compact>
                <Input
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onPressEnter={handleSend}
                  placeholder="输入您的问题..."
                  disabled={refLoading || replyLoading}
                  style={{ width: 'calc(100% - 80px)' }}
                />
                <Button 
                  type="primary" 
                  icon={<SendOutlined />} 
                  onClick={handleSend}
                  disabled={refLoading || replyLoading || !inputValue.trim()}
                  loading={refLoading || replyLoading}
                >
                  发送
                </Button>
              </Input.Group>
            </div>
          </Card>
        </Col>

        {/* 右侧参考文献区域 */}
        <Col span={8}>
          <Card 
            title="相关文本" 
            bordered={false}
            extra={
              <div className="flex items-center">
                <ClockCircleOutlined className="mr-1" />
                <Text type="secondary">获取耗时: {referenceTime.toFixed(2)}秒</Text>
              </div>
            }
          >
            {refLoading ? (
              <div className="text-center py-8">
                <Spin tip="正在查找相关资料..." size="large" />
              </div>
            ) : references.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={references}
                renderItem={item => (
                  <List.Item>
                    <Card size="small" style={{ width: '100%' }} className="hover:shadow-md transition">
                      <Card.Meta
                        title={<Text strong>{item.title}({item.score})</Text>}
                        description={<Text type="secondary">{item.content}</Text>}
                      />
                    </Card>
                  </List.Item>
                )}
              />
            ) : (
              <Alert 
                message="等待问题输入" 
                description="发送消息后，相关的文本将显示在这里" 
                type="info" 
                showIcon 
              />
            )}
          </Card>
          
          
        </Col>
      </Row>
    </div>
  );
};

export default KnowledgeTestPage;