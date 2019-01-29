enum Sides {
  BLUFOR = 'blufor',
  OPFOR = 'opfor',
  INDEPENDENT = 'independent',
  CIVILIAN = 'civilian',
}

const stringToSide = (side: string = ''): Sides | null =>
  ({
    west: Sides.BLUFOR,
    east: Sides.OPFOR,
    independent: Sides.INDEPENDENT,
    civilian: Sides.CIVILIAN,
  }[side.toLowerCase()] || null)

export interface Attributes {
  property?: string
  expression?: string
  value?: string | number
}

export interface Unit {
  sqmId: number
  type: string
  side: Sides
  customAttrs: Attributes[]
  attrs: {
    description?: string
    init?: string
    isPlayable?: 0 | 1
    isPlayer?: 0 | 1
  }
}

export interface Group {
  sqmId: number
  side: Sides
  groupId: string
  units: Unit[]
  attrs: Attributes[]
}

export { stringToSide, Sides }
