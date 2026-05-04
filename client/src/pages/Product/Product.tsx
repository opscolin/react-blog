import { useParams } from 'react-router-dom';

const productNames: Record<string, string> = {
  weiguang: '微光',
  shunian: '树年'
};

export default function Product() {
  const { productId } = useParams<{ productId: string }>();
  const title = productId ? productNames[productId] || '产品' : '产品';

  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1>{title}</h1>
      <p>该产品即将上线，敬请期待...</p>
    </div>
  );
}