import React from 'react';

const AppCard = ({ app, isNew = false, onClick }) => {
  if (isNew) {
    return (
      <div className="app-card" onClick={onClick} style={{ justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>+</div>
          <div style={{ fontWeight: '600', fontSize: '18px' }}>创建新应用</div>
          <div style={{ color: 'var(--gray-500)', marginTop: '8px' }}>开始构建你的第一个LLM应用</div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case '在线':
        return 'tag-success';
      case '离线':
        return 'tag-warning';
      case '错误':
        return 'tag-danger';
      default:
        return '';
    }
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case '生产中':
        return 'tag-primary';
      case '测试中':
        return 'tag-primary';
      case '草稿':
        return 'tag-gray';
      default:
        return '新功能-待开发';
    }
  };

  return (
    <div className="app-card">
      <div className="app-header">
        <div className="app-icon">{app.icon}</div>
        <div className="app-title">{app.name}</div>
        <div className="app-desc">{app.description}</div>
      </div>
      <div className="app-body">
        <div className="app-meta">
          <div className="meta-item">
            <div className="meta-label">模型</div>
            <div className="meta-value">{app.chunking_model}</div>
          </div>
          <div className="meta-item">
            <div className="meta-label">调用次数</div>
            <div className="meta-value">{app.usage}</div>
          </div>
          <div className="meta-item">
            <div className="meta-label">最后更新</div>
            <div className="meta-value">{app.updated_at}</div>
          </div>
        </div>
        <div className={`tag ${getStageColor(app.stage)}`}>{app.stage}</div>
      </div>
      <div className="app-footer">
        <div className={`tag ${getStatusColor(app.status)}`}>{app.status}</div>
        <div className="app-actions">
          <button>编辑</button>
          <button>部署</button>
        </div>
      </div>
    </div>
  );
};

export default AppCard;