const PlanCards = ({ type, price, features, isSelected, onSelect }) => (
  <div 
    onClick={() => onSelect(type)}
    className={`cursor-pointer p-6 border-2 rounded-3xl transition-all duration-300 relative overflow-hidden ${
      isSelected 
        ? 'border-orange-600 bg-orange-50/50 shadow-2xl shadow-orange-100' 
        : 'border-zinc-100 bg-white hover:border-zinc-300'
    }`}
  >
    {isSelected && (
      <div className="absolute top-0 right-0 bg-orange-600 text-white text-[8px] font-black px-3 py-1 uppercase tracking-widest rounded-bl-xl">
        Selected
      </div>
    )}
    <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">{type} Node</h3>
    <div className="flex items-baseline gap-1 mb-6">
      <span className="text-3xl font-bold text-zinc-900">${price}</span>
      <span className="text-zinc-400 text-[10px] uppercase font-bold">/mo</span>
    </div>
    <ul className="space-y-3 mb-8">
      {features.map((f, i) => (
        <li key={i} className="text-xs text-zinc-600 flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-orange-600" /> {f}
        </li>
      ))}
    </ul>
    <button className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
      isSelected ? 'bg-orange-600 text-white' : 'bg-zinc-100 text-zinc-400'
    }`}>
      {isSelected ? 'Ready to Initialize' : 'Select Tier'}
    </button>
  </div>
);

export default PlanCards;
