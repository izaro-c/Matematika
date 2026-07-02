import type JXG from 'jsxgraph';

export type DiagramBoard = JXG.Board;
export type DiagramElement = JXG.GeometryElement;
export type DiagramElementRegistry = Record<string, unknown>;
export type DiagramBoundingBox = readonly [number, number, number, number];
