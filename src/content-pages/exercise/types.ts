import React from 'react';

export type QuestionType = 'hueco' | 'pregunta' | 'emparejar' | 'canvas' | 'matriz' | 'ordenacion';

export interface Opcion {
  value: string;
  texto: string;
  feedback?: string;
}

export interface Pair {
  left: string;
  right: string;
}

export interface BucketDef {
  id: string;
  title: string;
}

export interface ItemDef {
  id: string;
  content: string;
  bucketId: string;
}

export interface ErrorComunData {
  titulo?: string;
  title?: string;
  children: React.ReactNode;
}

export interface ResolucionData {
  children: React.ReactNode;
}

export type ExerciseCardTab = 'pregunta' | 'error' | 'resolucion';

export interface BaseQuestionProps {
  id: string;
  children?: React.ReactNode;
}

export interface ErrorComunProps {
  titulo?: string;
  title?: string;
  children: React.ReactNode;
  questionId?: string;
}

export interface ResolucionProps {
  children: React.ReactNode;
}
