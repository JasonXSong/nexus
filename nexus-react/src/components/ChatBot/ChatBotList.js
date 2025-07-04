import React from 'react';
import { Row, Col, Card, Tag, Empty } from 'antd';
import ChatBotCard from './ChatBotCard';

const ChatBotList = ({ bots, refresh }) => {
  return (
    <div>
      {bots.length === 0 ? (
        <Empty description="暂无聊天机器人" />
      ) : (
        <Row gutter={[16, 16]}>
          {bots.map(bot => (
            <Col key={bot.id} xs={24} sm={12} md={8} lg={6}>
              <ChatBotCard bot={bot} refresh={refresh} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ChatBotList;