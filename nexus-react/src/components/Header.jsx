import React from 'react';

const Header = ({ onCreateApp }) => {
  return (
    <div className="header">
      <h1>我的应用</h1>
      <div className="header-actions">
        <button className="btn btn-outline">
          <span>🔄</span> 刷新
        </button>
        <button className="btn btn-primary" onClick={onCreateApp}>
          <span>+</span> 创建应用
        </button>
      </div>
    </div>
  );
};

export default Header;