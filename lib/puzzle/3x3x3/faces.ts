export enum PieceColor {
  Orange = 1,
  White,
  Green,
  Yellow,
  Red,
  Blue,
}

export enum FaceIndex {
  L = 0,
  U,
  F,
  D,
  R,
  B,
}

export const PieceColorHex: Record<PieceColor, string> = {
  [PieceColor.Orange]: '#ffa500',
  [PieceColor.White]: '#ffffff',
  [PieceColor.Green]: '#00ff00',
  [PieceColor.Yellow]: '#ffff00',
  [PieceColor.Red]: '#ff0000',
  [PieceColor.Blue]: '#0000ff',
}
