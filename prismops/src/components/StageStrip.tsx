import { STAGES } from '../data/constants';
// The signature element: one segment per stage, so progress reads at a glance.
export default function StageStrip({ index }: { index: number }) {
  return (
    <div>
      <div className="strip" role="img" aria-label={index >= STAGES.length ? 'تم التسليم' : STAGES[index]}>
        {STAGES.map((s, i) => <i key={s} className={i < index ? 'done' : i === index ? 'cur' : ''} />)}
      </div>
      <div className="strip-label">{index >= STAGES.length ? 'تم التسليم' : STAGES[index]}</div>
    </div>
  );
}
