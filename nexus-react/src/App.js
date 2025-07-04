import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import ChatBotsPage from './pages/ChatBotsPage';
import KnowledgePage from './pages/KnowledgePage';
import KnowledgeTestPage from './pages/KnowledgeTestPage';

const { Header, Content, Sider } = Layout;

const App = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider>
          <div className="logo p-4 text-white text-xl font-bold">Dify Clone</div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Link to="/chatbots">聊天机器人</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/knowledge">知识库管理</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Routes>
                <Route path="/chatbots" element={<ChatBotsPage />} />
                <Route path="/knowledge" element={<KnowledgePage />} />
                <Route path="/" element={<ChatBotsPage />} />
                <Route path="/knowledge/:knowledge_id/test" element={<KnowledgeTestPage />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;