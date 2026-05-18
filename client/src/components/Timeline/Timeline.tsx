import dayjs from 'dayjs';

interface DiaryEntry {
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

interface TimelineProps {
  entries: DiaryEntry[];
  onEntryClick?: (entry: DiaryEntry) => void;
}

export default function Timeline({ entries, onEntryClick }: TimelineProps) {
  return (
    <section className="diary-timeline">
      <div className="timeline-line" />
      <div className="timeline-entries">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className={`timeline-entry ${entry.type === 'ai' ? 'ai-entry' : ''} ${index % 2 === 0 ? 'left' : 'right'}`}
            onClick={() => onEntryClick?.(entry)}
          >
            <div className="timeline-content">
              <div className="timeline-card">
                <div className="timeline-meta">
                  <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{dayjs(entry.created_at).format('YYYY.MM.DD')}</span>
                  {entry.type === 'ai' && <span className="ai-insight-badge">AI INSIGHT</span>}
                </div>
                <h4 className="timeline-title">{entry.title}</h4>
                <p className="timeline-excerpt">{entry.content}</p>
                {entry.type === 'ai' && entry.ai_summary && (
                  <div className="ai-insight-content">
                    <p className="ai-summary">{entry.ai_summary}</p>
                    {entry.ai_growth_tips && entry.ai_growth_tips.length > 0 && (
                      <ul className="ai-tips">
                        {entry.ai_growth_tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                <div className="timeline-tags">
                  {entry.tags.map((tag, i) => (
                    <span key={i} className="timeline-tag">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="timeline-dot">
              <div className="dot-inner" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}