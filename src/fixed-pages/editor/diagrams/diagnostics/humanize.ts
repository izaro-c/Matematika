import type { DiagramTarget } from '@/fixed-pages/editor/core/editorTypes';
import type { DiagramDiagnostic } from '../source/generator';
import type { DiagramDiagnosticLocation } from './types';

export interface HumanizedDiagnostic {
  title: string;
  message: string;
  hint: string;
}

const COLLECTION_LABELS: Record<string, string> = {
  points: 'punto',
  elements: 'elemento',
  sliders: 'control',
  constraints: 'restricción',
  steps: 'paso',
  groups: 'grupo',
  layers: 'capa',
  objects: 'objeto',
};

function replaceTargetIds(text: string, targets: DiagramTarget[]): string {
  let result = text;
  targets.forEach(target => {
    if (target.label && target.label !== target.id) {
      const regex = new RegExp(`\\b${target.id}\\b`, 'g');
      result = result.replace(regex, `"${target.label}" (${target.id})`);
    }
  });
  return result;
}

function humanizeZodMessage(message: string): string {
  let text = message;
  text = text.replace(/Expected string, received (\w+)/g, 'Se esperaba un texto pero se recibió $1.');
  text = text.replace(/Expected number, received (\w+)/g, 'Se esperaba un número pero se recibió $1.');
  text = text.replace(/Invalid option: expected one of [^,\n]+/g, 'La opción seleccionada no pertenece a las opciones válidas.');
  text = text.replace(/Invalid enum value/g, 'El valor no es válido.');
  text = text.replace(/Required/g, 'Campo obligatorio no especificado.');
  text = text.replace(/Too small: expected .+/g, 'El valor es demasiado pequeño.');
  text = text.replace(/Too big: expected .+/g, 'El valor es demasiado grande.');
  return text;
}

function objectLabel(location: DiagramDiagnosticLocation, objectId?: string): string {
  if (objectId) return objectId;
  if (location.collection && location.index !== undefined) {
    const kind = COLLECTION_LABELS[location.collection] ?? location.collection;
    return `${kind} #${location.index + 1}`;
  }
  return 'el diagrama';
}

function fieldHint(field: string | undefined, location: DiagramDiagnosticLocation): string {
  if (field === 'refs' || field?.endsWith('.refs')) {
    return 'Seleccione los puntos u objetos que esta construcción necesita en el inspector de propiedades.';
  }
  if (field === 'kind') {
    return 'Elija un tipo geométrico compatible en el inspector del elemento.';
  }
  if (field === 'gliderTarget') {
    return 'Indique sobre qué segmento, recta o curva debe deslizarse el punto.';
  }
  if (field === 'xExpression' || field === 'yExpression' || field === 'dependencies') {
    return 'En Geometría, complete las expresiones x/y y marque las dependencias del punto derivado.';
  }
  if (field === 'componentId' || field === 'title') {
    return 'Revise la identidad del diagrama en el panel Diagrama del lateral izquierdo.';
  }
  if (location.collection === 'steps') {
    return 'Abra la pestaña Secuencia y corrija el paso indicado.';
  }
  if (location.collection === 'constraints') {
    return 'Revise las relaciones geométricas del objeto seleccionado en el inspector.';
  }
  if (location.workspace === 'source') {
    return 'Corrija el código TSX en la pestaña Código TSX o vuelva al modelo visual.';
  }
  if (location.objectId) {
    return 'Seleccione el objeto resaltado y corrija el campo indicado en el inspector.';
  }
  return 'Revise el diagrama en la pestaña Comprobar y corrija el problema señalado.';
}

function titleForDiagnostic(diagnostic: DiagramDiagnostic, location: DiagramDiagnosticLocation): string {
  if (diagnostic.code === 'invalid-component-name') return 'Nombre de componente inválido';
  if (diagnostic.code === 'invalid-source' || diagnostic.source === 'source') return 'Error en el código TSX';
  if (diagnostic.source === 'synchronization') return 'Sincronización modelo/código';
  if (location.field === 'refs') return 'Referencia incompleta';
  if (location.field === 'kind') return 'Tipo no válido';
  if (location.field === 'xExpression' || location.field === 'yExpression' || location.field === 'dependencies') {
    return 'Punto derivado incompleto';
  }
  if (diagnostic.message.includes('obligatorio') || diagnostic.message.includes('Required')) return 'Campo obligatorio';
  if (diagnostic.message.includes('punto derivado') || diagnostic.message.includes('expresiones x/y')) {
    return 'Punto derivado incompleto';
  }
  if (diagnostic.severity === 'warning') return 'Aviso de coherencia';
  return 'Error de validación';
}

export function humanizeDiagnostic(
  diagnostic: DiagramDiagnostic,
  location: DiagramDiagnosticLocation,
  objectId: string | undefined,
  targets: DiagramTarget[] = [],
): HumanizedDiagnostic {
  const label = objectLabel(location, objectId);
  const field = location.field;
  let message = humanizeZodMessage(diagnostic.message);

  if (diagnostic.code === 'invalid-component-name') {
    return {
      title: 'Nombre de componente inválido',
      message: 'El nombre del componente debe usar PascalCase y contener solo letras o números.',
      hint: 'Cambie el nombre del componente en la configuración del diagrama antes de guardar.',
    };
  }

  if (diagnostic.source === 'source' || location.workspace === 'source') {
    return {
      title: 'Error en el código TSX',
      message: replaceTargetIds(message, targets),
      hint: 'Corrija el código en la pestaña Código TSX o restaure la autoridad del modelo visual.',
    };
  }

  if (location.collection && location.index !== undefined && field) {
    const kind = COLLECTION_LABELS[location.collection] ?? location.collection;
    const prefix = `En el ${kind} ${label}`;
    if (!message.startsWith('En ')) {
      message = `${prefix} (${field}): ${message}`;
    }
  } else if (objectId && !message.includes(objectId)) {
    message = `En ${label}: ${message}`;
  }

  message = replaceTargetIds(message, targets);

  return {
    title: titleForDiagnostic(diagnostic, location),
    message,
    hint: fieldHint(field, location),
  };
}
