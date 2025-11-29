import { describe, it, expect } from 'vitest';
import { parsePilotData } from './parser';

describe('parsePilotData', () => {
    it('should parse valid HTML correctly', () => {
        const mockHtml = `
			<html>
				<body>
					<table>
						<tr><td>2025-11-28 금요일</td></tr>
						<tr><td>일출: 07:00</td></tr>
					</table>
					<table>
						<thead>
							<tr>
								<th>No</th><th>상태</th><th>도선사</th><th>일자</th><th>시간</th><th>긴특</th><th>선명</th>
								<th>도선구간</th><th>도선구간</th><th>Side</th><th>톤수</th><th>홀수</th><th>대리점</th>
								<th>접안</th><th>예선</th><th>강취</th><th>호출</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>1</td><td>요청</td><td>홍길동</td><td>11-28</td><td>10:00</td><td></td><td>TEST SHIP</td>
								<td>IPA</td><td>E12</td><td>P</td><td>10,000</td><td>8.5</td><td>AGENCY</td>
								<td>B1</td><td>2</td><td>Y</td><td>CALLSIGN</td>
							</tr>
						</tbody>
					</table>
				</body>
			</html>
		`;

        const result = parsePilotData(mockHtml);

        expect(result.dateInfo).toContain('2025-11-28');
        expect(result.sunInfo).toContain('일출: 07:00');
        expect(result.ships).toHaveLength(1);
        expect(result.ships[0].name).toBe('TEST SHIP');
        expect(result.ships[0].pilot).toBe('홍길동');
        expect(result.ships[0].sections).toEqual(['IPA', 'E12']);
    });

    it('should handle empty or invalid HTML gracefully', () => {
        const result = parsePilotData('<html></html>');
        expect(result.ships).toHaveLength(0);
        expect(result.dateInfo).toBe('날짜 정보 없음');
    });
});
