import { Link } from 'react-router-dom';
import './Pagination.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  basePath?: string;
}

export default function Pagination({ page, totalPages, basePath = '' }: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  const getPath = (p: number) => `${basePath}?page=${p}`;

  return (
    <div className="pagination">
      {prevPage ? (
        <Link to={getPath(prevPage)} className="pagination-link">← 上一页</Link>
      ) : (
        <span className="pagination-disabled">← 上一页</span>
      )}
      <span className="pagination-info">{page} / {totalPages}</span>
      {nextPage ? (
        <Link to={getPath(nextPage)} className="pagination-link">下一页 →</Link>
      ) : (
        <span className="pagination-disabled">下一页 →</span>
      )}
    </div>
  );
}
