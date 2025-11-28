import { useState, useMemo } from 'react';
import { Ship } from '../types';

export function useShipFilter(ships: Ship[] = []) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredShips = useMemo(() => {
        return ships.filter((ship) => {
            const matchesStatus =
                statusFilter === 'all'
                    ? true
                    : statusFilter === 'doing'
                        ? ['도선중', '승선'].some(s => ship.status.includes(s))
                        : ['하선', '완료'].some(s => ship.status.includes(s));

            const matchesSearch =
                ship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (ship.agency && ship.agency.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (ship.pilot && ship.pilot.toLowerCase().includes(searchTerm.toLowerCase()));

            return matchesStatus && matchesSearch;
        });
    }, [ships, searchTerm, statusFilter]);

    return {
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        filteredShips,
    };
}
