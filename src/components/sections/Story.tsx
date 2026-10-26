import { bi, isObject, num, objects, str } from '@/lib/config';
import { Live } from './Live';
import type { SectionProps } from './shared';

export function Story({ s, ctx }: SectionProps) {
  const { lang } = ctx; const f = s.fields;
  const stats = isObject(f.stats) ? f.stats : null;
  const nums = objects(s.items);
  const quote = bi(f, 'quote', lang);
  return (
    <>
      {stats ? <Live lang={lang} stats={{ containers: num(stats.containers), shipments: num(stats.shipments), clients: num(stats.clients), ontime: num(stats.ontime), updated: str(stats.updated), placeholder: stats.placeholder === true }} /> : null}
      <section id="story" className="bg-white">
        <div className="wrap story rv">
          <div>
            {f.placeholder === true && bi(f, 'exampleTag', lang) ? <span className="example-tag">{bi(f, 'exampleTag', lang)}</span> : null}
            <p className="eyebrow">{bi(f, 'eyebrow', lang)}</p>
            <h2 style={{ marginTop: 12 }}>{bi(f, 'title', lang)}</h2>
            <p className="lead" style={{ marginTop: 14 }}>{bi(f, 'lead', lang)}</p>
            {nums.length ? <div className="story-nums">{nums.map((n, i) => <div key={i}><b>{bi(n, 'value', lang)}</b><span>{bi(n, 'label', lang)}</span></div>)}</div> : null}
          </div>
          {quote ? (
            <div className="story-q">
              <p>{quote}</p>
              <div className="who"><i>{(bi(f, 'author', lang) || 'PM').slice(0, 2).toUpperCase()}</i><div><b>{bi(f, 'author', lang)}</b><span>{bi(f, 'authorOrg', lang)}</span></div></div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
