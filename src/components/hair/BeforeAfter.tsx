'use client';
import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, MoveHorizontal } from 'lucide-react';
import { results } from '@/lib/hair/results';
import { useMediaSource } from './MediaSources';

function ResultPhoto({ source, alt }: { source: string; alt: string }) {
  const media = useMediaSource();
  return <div className="ba-photo"><img
    src={media(`/images/results/${source}-800.webp`)}
    srcSet={[480, 800, 1122].map(width => `${media(`/images/results/${source}-${width}.webp`)} ${width}w`).join(', ')}
    sizes="(max-width: 750px) 90vw, 33vw"
    alt={alt} width={1122} height={1402} loading="lazy" decoding="async" draggable={false}
  /></div>;
}
function ComparisonCard({ result, index }: { result: (typeof results)[number]; index: number }) {
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);
  function move(event: PointerEvent<HTMLInputElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width) setPosition(Math.round(Math.min(100, Math.max(0, (event.clientX - bounds.left) / bounds.width * 100))));
  }
  return <article className="ba-card" aria-labelledby={`result-${result.id}`}>
    <div className="ba-card-top"><span>GÖRÜNÜM 0{index + 1}</span><span>YAKUP ÇAKAN</span></div>
    <div className="ba-image" style={{ '--split': `${position}%` } as CSSProperties}>
      <ResultPhoto source={result.after} alt={`${result.title}, sonrası görünümü`} />
      <div className="ba-before" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}><ResultPhoto source={result.before} alt={`${result.title}, öncesi görünümü`} /></div>
      <span className="ba-label ba-label-before" style={{ opacity: position < 10 ? 0 : 1 }}>ÖNCE</span>
      <span className="ba-label ba-label-after" style={{ opacity: position > 90 ? 0 : 1 }}>SONRA</span>
      <div className="ba-divider" aria-hidden="true" />
      <span className="ba-handle" aria-hidden="true"><ArrowLeft size={17} /><ArrowRight size={17} /></span>
      <input className="ba-range" type="range" min={0} max={100} step={1} value={position}
        aria-label={`${result.title}: önce ve sonra karşılaştırması`}
        aria-valuetext={`Önce yüzde ${position}, sonra yüzde ${100 - position}`}
        aria-describedby={`result-help-${result.id}`}
        onChange={event => setPosition(Number(event.target.value))}
        onPointerDown={event => { event.preventDefault(); event.currentTarget.focus(); dragging.current = true; event.currentTarget.setPointerCapture(event.pointerId); move(event); }}
        onPointerMove={event => { if (event.pointerType === 'mouse' || dragging.current) move(event); }}
        onPointerUp={event => { dragging.current = false; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
        onPointerCancel={() => { dragging.current = false; }} />
    </div>
    <div className="ba-case-caption"><h3 id={`result-${result.id}`}>{result.title}</h3><p>{result.description}</p></div>
    <div className="ba-controls" role="group" aria-label={`${result.title} görünümü`}>
      <button onClick={() => setPosition(100)} aria-pressed={position === 100}>Önce</button>
      <button onClick={() => setPosition(50)} aria-pressed={position === 50}>Karşılaştır</button>
      <button onClick={() => setPosition(0)} aria-pressed={position === 0}>Sonra</button>
    </div>
    <span className="visually-hidden" id={`result-help-${result.id}`}>Sol ve sağ ok tuşlarıyla ayarlayın. Home sonrası, End öncesi görünümünü açar.</span>
  </article>;
}
export default function BeforeAfter() {
  return <section className="before-after-section" id="once-sonra" aria-labelledby="before-after-title"><div className="section ba-collection">
    <div className="section-heading"><div><div className="eyebrow">YAKINDAN BAKIN / ÖNCESİ VE SONRASI</div><h2 id="before-after-title">Her değişimin<br /><em>kendi hikâyesi var.</em></h2></div><p>Üç farklı görünümü yakından keşfedin.<br />Her fotoğrafın çizgisini ayrı ayrı kaydırarak inceleyin.</p></div>
    <div className="ba-cases">{results.map((result, index) => <ComparisonCard key={result.id} result={result} index={index} />)}</div>
    <div className="ba-collection-footer"><p><MoveHorizontal size={20} /> Fareyle gezdirin veya parmağınızla kaydırın.</p><a href="https://www.instagram.com/yakupcakan/" target="_blank" rel="noreferrer" className="text-link">Instagram’da daha fazla dönüşüm <ArrowUpRight size={18} /></a></div>
    <p className="ba-credit">Görsel karşılaştırmalar, saç çizgisi ve stil farklarını incelemeniz için sunulmuştur.</p>
  </div></section>;
}
