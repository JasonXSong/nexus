import React from 'react';
import { Row, Col, Empty } from 'antd';
import KnowledgeCard from './KnowledgeCard';

const KnowledgeList = ({ knowledgeBases, refresh }) => {
  return (
    <div>
      {knowledgeBases.length === 0 ? (
        <Empty description="暂无知识库" />
      ) : (
        <Row gutter={[16, 16]}>
          {knowledgeBases.map(kb => (
            <Col key={kb.id} xs={24} sm={12} md={8} lg={6}>
              <KnowledgeCard knowledge={kb} refresh={refresh} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default KnowledgeList;