import JXG from 'jsxgraph';

export type JXGBoardLike = JXG.Board & {
  renderer: JXG.Board['renderer'] & {
    container: {
      style: {
        backgroundColor: string;
      }
    }
  };
  [key: string]: any;
};

export type JXGElementLike = JXG.GeometryElement & {
  Dist?: (other: any) => number;
  X?: () => number;
  Y?: () => number;
  moveTo?: (coords: number[], time?: number) => void;
  [key: string]: any;
};
