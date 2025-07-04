import React, { useState, useEffect } from 'react';
import { Button, Row, Col } from 'antd';
import KnowledgeList from '../components/KnowledgeBase/KnowledgeList';
import CreateKnowledge from '../components/KnowledgeBase/CreateKnowledge';
import { fetchKnowledgeBases } from '../services/KnowledgeService';

const KnowledgePage = () => {
  const [knowledgeBases, setKnowledgeBases] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadKnowledge = async () => {
    const data = await fetchKnowledgeBases();
    setKnowledgeBases(data);
  };

  useEffect(() => {
    loadKnowledge();
  }, []);

  return (
    <div className="p-6">
      <Row justify="space-between" align="middle" className="mb-6">
        <Col>
          <h1 className="text-2xl font-bold">知识库管理</h1>
        </Col>
        <Col>
          <Button 
            type="primary" 
            onClick={() => setShowCreateModal(true)}
          >
            新建知识库
          </Button>
        </Col>
      </Row>
      
      <KnowledgeList knowledgeBases={knowledgeBases} refresh={loadKnowledge} />
      
      <CreateKnowledge 
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={loadKnowledge}
      />
    </div>
  );
};

export default KnowledgePage;