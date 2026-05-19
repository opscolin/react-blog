import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import api from '../../api';
import Timeline from '../../components/Timeline/Timeline';
import './Diary.css';

interface Diary {
  id: number;
  title: string;
  content: string;
  tags: string[];
  type: 'diary' | 'ai';
  ai_summary?: string;
  ai_growth_tips?: string[];
  ai_sentiment?: string;
  created_at: string;
}

interface Stats {
  totalEntries: number;
  last30DaysEntries: number;
  daysJoined: number;
  aiEntriesCount: number;
  tagStats: { tag: string; count: number }[];
  monthlyStats: { month: string; count: number }[];
}

function DiaryModal({ diary, onClose }: { diary: Diary; onClose: () => void }) {
  return (
    <div className="diary-modal-overlay" onClick={onClose}>
      <div className="diary-modal" onClick={e => e.stopPropagation()}>
        <button className="diary-modal-close" onClick={onClose}>×</button>
        <div className="diary-modal-meta">
          <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{dayjs(diary.created_at).format('YYYY.MM.DD')}</span>
          {diary.type === 'ai' && <span className="ai-insight-badge">AI INSIGHT</span>}
        </div>
        <h2 className="diary-modal-title">{diary.title}</h2>
        <p className="diary-modal-content">{diary.content}</p>
        {diary.type === 'ai' && diary.ai_summary && (
          <div className="ai-insight-content">
            <p className="ai-summary">{diary.ai_summary}</p>
            {diary.ai_growth_tips && diary.ai_growth_tips.length > 0 && (
              <ul className="ai-tips">
                {diary.ai_growth_tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        {diary.tags.length > 0 && (
          <div className="diary-modal-tags">
            {diary.tags.map((tag, i) => (
              <span key={i} className="diary-tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Diary() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [timeline, setTimeline] = useState<Diary[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'list' | 'timeline'>('list');
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);

  const loadData = useCallback(async (isInitial: boolean) => {
    if (isInitial) setInitialLoading(true);
    try {
      const [diariesRes, statsRes] = await Promise.all([
        api.get('/diaries', { params: { search: searchTerm || undefined, limit: 50 } }),
        api.get('/diaries/stats')
      ]);
      setDiaries(diariesRes.data.diaries);
      setStats(statsRes.data);
      const timelineRes = await api.get('/diaries/timeline', { params: { search: searchTerm || undefined } });
      const allEntries: Diary[] = [];
      Object.entries(timelineRes.data as Record<string, Record<string, Diary[]>>).forEach(([, months]) => {
        Object.entries(months).forEach(([, entries]) => {
          allEntries.push(...entries);
        });
      });
      allEntries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setTimeline(allEntries);
    } catch (error) {
      console.error('Failed to load diaries:', error);
    }
    if (isInitial) setInitialLoading(false);
  }, [searchTerm]);

  useEffect(() => {
    if (initialLoading) {
      loadData(true);
    } else {
      const timer = setTimeout(() => loadData(false), 300);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, initialLoading, loadData]);

  if (initialLoading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <main className="diary-page">
      {selectedDiary && (
        <DiaryModal diary={selectedDiary} onClose={() => setSelectedDiary(null)} />
      )}

      {stats && (
        <section className="diary-stats">
          <div className="stats-main">
            <div className="stats-card">
              <p className="stats-label">加入时光</p>
              <p className="stats-value">
                {stats.daysJoined} <span className="stats-unit">days</span>
              </p>
            </div>
            <div className="stats-divider" />
            <div className="stats-card">
              <p className="stats-label">累计记录</p>
              <p className="stats-value">
                {stats.totalEntries} <span className="stats-unit">items</span>
              </p>
            </div>
            <div className="stats-divider" />
            <div className="stats-card">
              <p className="stats-label">最近30天</p>
              <p className="stats-value">
                {stats.last30DaysEntries} <span className="stats-unit">freq</span>
              </p>
            </div>
          </div>
        </section>
      )}

      <header className="diary-header">
        <div className="diary-controls">
          <input
            type="text"
            className="diary-search"
            placeholder="搜索日记..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className="diary-views">
            <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>列表</button>
            <button className={view === 'timeline' ? 'active' : ''} onClick={() => setView('timeline')}>时间轴</button>
          </div>
        </div>
      </header>

      {view === 'timeline' && (
        <Timeline entries={timeline} onEntryClick={setSelectedDiary} />
      )}

      {view === 'list' && (
        <section className="diary-list">
          {diaries.length > 0 ? (
            diaries.map(diary => (
              <article
                key={diary.id}
                className={`diary-card ${diary.type === 'ai' ? 'ai-card' : ''}`}
                onClick={() => setSelectedDiary(diary)}
              >
                <header className="diary-card-header">
                  <div className="diary-card-meta">
                    <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className="diary-card-date">{dayjs(diary.created_at).format('YYYY.MM.DD')}</span>
                    {diary.type === 'ai' && <span className="ai-insight-badge">AI INSIGHT</span>}
                  </div>
                  <h2 className="diary-card-title">{diary.title}</h2>
                </header>
                <p className="diary-card-content">{diary.content}</p>
                {diary.type === 'ai' && diary.ai_summary && (
                  <div className="ai-insight-content">
                    <p className="ai-summary">{diary.ai_summary}</p>
                    {diary.ai_growth_tips && diary.ai_growth_tips.length > 0 && (
                      <ul className="ai-tips">
                        {diary.ai_growth_tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                {diary.tags.length > 0 && (
                  <div className="diary-card-tags">
                    {diary.tags.map((tag, i) => (
                      <span key={i} className="diary-tag">#{tag}</span>
                    ))}
                  </div>
                )}
              </article>
            ))
          ) : (
            <p className="empty">暂无日记</p>
          )}
        </section>
      )}
    </main>
  );
}