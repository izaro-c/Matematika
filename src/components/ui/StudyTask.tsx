import React from 'react';
import { Link } from 'wouter';
import { useProgressStore } from '../../store/UserProgressStore';
import { db } from '../../store/ContentStore';
import { StudyPlanContext } from '../../contexts/StudyPlanContext';

interface StudyTaskProps {
  id: string;
  type: 'teorema' | 'ejercicio' | 'ejemplo' | 'caso' | 'lección' | 'definicion';
  title: string;
}

export const StudyTask: React.FC<StudyTaskProps> = ({ id, type, title }) => {
  const { isRead } = useProgressStore();
  const completed = isRead(id);
  const context = React.useContext(StudyPlanContext);
  const registerTaskRef = context?.registerTaskRef;
  
  let href = '';
  switch (type) {
    case 'teorema': href = `/teorema/${id}`; break;
    case 'ejercicio': href = `/ejercicio/${id}`; break;
    case 'ejemplo': href = `/ejemplo/${id}`; break;
    case 'caso': href = `/caso/${id}`; break;
    case 'definicion': href = `/definicion/${id}`; break;
    case 'lección': href = `/${id}`; break;
    default: href = `/${id}`;
  }

  const isTheory = ['teorema', 'definicion', 'lección'].includes(type);
  const isPractice = ['ejercicio', 'ejemplo', 'caso'].includes(type);

  const containerStyle = isTheory ? 'border-solid bg-lienzo' : 'border-dashed border-2 bg-carbon/[0.02]';

  // Verificar que el elemento existe, de lo contrario lo mostramos como próximamente
  let exists = false;
  if (type === 'teorema') exists = !!db.getTheorem(id);
  else if (type === 'ejercicio') exists = !!db.getExercise(id);
  else if (type === 'ejemplo') exists = !!db.getExample(id);
  else if (type === 'caso') exists = !!db.getUseCase(id);
  else if (type === 'definicion') exists = !!db.getDefinition(id);
  // Asumimos que los que no podemos verificar tan fácil (lección general) existen o los renderizamos igual

  if (!exists && type !== 'lección') {
    return (
      <div ref={(el) => registerTaskRef?.(id, el)} className={`flex flex-col md:flex-row md:items-center gap-4 p-5 my-6 border-carbon/20 opacity-60 ${containerStyle}`}>
        <div className="w-5 h-5 border border-carbon/20 flex items-center justify-center shrink-0">
          <span className="text-carbon/20 text-[10px]">◈</span>
        </div>
        <div>
          <div className="text-[9px] font-sans uppercase tracking-[0.2em] text-carbon/40 mb-1">{type}</div>
          <h3 className="text-xl font-serif text-carbon" style={{ fontVariant: 'small-caps' }}>{title}</h3>
          <div className="text-xs italic text-carbon/40 mt-1">Próximamente</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={(el) => registerTaskRef?.(id, el)}>
      <Link href={href}>
        <a className={`group flex flex-col md:flex-row md:items-center gap-4 p-5 my-6 transition-all duration-300 ${containerStyle} ${completed ? 'border-salvia/30 bg-salvia/5 hover:border-salvia/50 hover:shadow-sm' : 'border-carbon/20 hover:border-terracota/40 hover:shadow-md hover:-translate-y-0.5'}`}>
          <div className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-all duration-500 ${
            completed 
              ? 'border-salvia bg-transparent rotate-45' 
              : 'border-carbon/40 rotate-0 group-hover:rotate-45 group-hover:border-terracota'
          }`}>
            {completed && (
              <div className="w-3 h-3 bg-salvia scale-animation"></div>
            )}
          </div>
          <div className="flex-1">
            <div className={`text-[9px] font-sans uppercase tracking-[0.2em] mb-1 transition-colors ${completed ? 'text-salvia/60' : 'text-carbon/40 group-hover:text-terracota/70'}`}>
              {type}
            </div>
            <h3 className={`text-xl font-serif font-bold transition-colors ${completed ? 'text-salvia' : 'text-carbon group-hover:text-terracota'}`} style={{ fontVariant: 'small-caps' }}>
              {title}
            </h3>
          </div>
          <div className={`text-[10px] font-sans uppercase tracking-widest transition-colors ${completed ? 'text-salvia' : 'text-carbon/30 group-hover:text-terracota/80'}`}>
            {completed ? 'Asimilado' : (isPractice ? 'Practicar →' : 'Estudiar →')}
          </div>
        </a>
      </Link>
    </div>
  );
};
