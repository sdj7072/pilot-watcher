import { describe, it, expect } from 'vitest';
import { getPilotType } from './pilotUtils';

describe('getPilotType', () => {
    it('should return null for empty or single section', () => {
        expect(getPilotType([])).toBeNull();
        expect(getPilotType(['IPA'])).toBeNull();
    });

    it('should identify Anchoring (투묘)', () => {
        const result = getPilotType(['IPA', 'ANCH']);
        expect(result?.type).toBe('투묘');
    });

    it('should identify Heaving Up (양묘)', () => {
        const result = getPilotType(['ANCH', 'IPA']);
        expect(result?.type).toBe('양묘');
    });

    it('should identify Arrival (입항)', () => {
        getPilotType(['IPA', 'E12']); // IPA is not Sea in list? Wait, IPA is Pilot Station. 
        // Let's check the list in pilotUtils.ts: ['P.S', 'E12', 'E-12', 'E14', 'E-14', 'E16', 'E-16', 'NO.1', 'NO.2']
        // IPA is NOT in the list. 
        // If IPA is not in list, then isSea('IPA') is false.
        // If E12 is in list, isSea('E12') is true.
        // !isSea('IPA') && isSea('E12') -> Departure (출항).

        // Wait, usually IPA (Ippado) is the sea station.
        // Let's re-read the logic in pilotUtils.ts.
        // const isSea = (loc: string) => ['P.S', 'E12', 'E-12', 'E14', 'E-14', 'E16', 'E-16', 'NO.1', 'NO.2'].some(k => loc.includes(k));

        // If Start is 'E12' (Sea) and End is 'Pyeongtaek' (Not Sea) -> Arrival.
        const arrival = getPilotType(['E12', 'Pyeongtaek']);
        expect(arrival?.type).toBe('입항');
    });

    it('should identify Departure (출항)', () => {
        // Start Not Sea, End Sea
        const departure = getPilotType(['Pyeongtaek', 'E12']);
        expect(departure?.type).toBe('출항');
    });

    it('should identify Shift (이항)', () => {
        // Start Not Sea, End Not Sea
        const shift = getPilotType(['Berth1', 'Berth2']);
        expect(shift?.type).toBe('이항');
    });

    it('should correctly classify E14 as Sea', () => {
        // E14 -> Port = Arrival
        const arrival = getPilotType(['E14', 'Port']);
        expect(arrival?.type).toBe('입항');

        // Port -> E14 = Departure
        const departure = getPilotType(['Port', 'E14']);
        expect(departure?.type).toBe('출항');
    });
});
