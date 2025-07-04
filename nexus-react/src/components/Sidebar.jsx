import React from 'react';

const Sidebar = () => {
  const navItems = [
    { icon: '📋', label: '我的应用', active: true },
    { icon: '🔄', label: '工作流' },
    { icon: '📚', label: '知识库', active: true},
    { icon: '⚙️', label: '模型设置' },
    { icon: '📊', label: '数据分析' },
    { icon: '👤', label: '账号设置' },
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <div className="logo-icon">L</div>
        <div className="logo-text">LangChain Studio</div>
      </div>
      
      <div className="nav-links">
        {navItems.map((item, index) => (
          <div key={index} className={`nav-item ${item.active ? 'active' : ''}`}>
            <div className="nav-icon">{item.icon}</div>
            <div>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;