export interface Ship {
    date: string;
    time: string;
    name: string;
    status: string;
    pilot: string;
    sections: string[];
    type: string; // tonnage
    kind: string;
    side: string;
    agency: string;
}

export interface Tide {
    time: string;
    height: string;
    current: string;
    maxTime: string;
    maxCurrent: string;
}

export interface PilotData {
    updatedAt: string;
    dateInfo: string;
    sunInfo: string;
    pilots: string[];
    tides: Tide[];
    ships: Ship[];
}

export type FilterType = 'ALL' | 'ING' | 'DONE';
