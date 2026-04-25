import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-text">页面不存在</p>
      <Link to="/" className="btn btn-primary">返回首页</Link>
    </div>
  );
}
