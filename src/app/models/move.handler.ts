import { Direction } from './direction';
import { Tile } from './tile.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/pairwise';

function operation(entry1: Tile[], entry2: Tile[]): number {
    let mergeScore = 0;
    if (entry1[0].merge(entry2[0])) mergeScore += entry1[0].value;
    if (entry1[1].merge(entry2[1])) mergeScore += entry1[1].value;
    if (entry1[2].merge(entry2[2])) mergeScore += entry1[2].value;
    if (entry1[3].merge(entry2[3])) mergeScore += entry1[3].value;
    return mergeScore;
}

function merge(operands: Tile[][][]): Observable<any> {
    return Observable.from(operands)
        .mergeMap(operand => {
            let delayTime = 0;
            return Observable.from(operand).pairwise().mergeMap(pair => {
                delayTime += 50;
                return Observable.of(pair).delay(delayTime);
            });
        })
        .map(([op1, op2]) => operation(op2, op1));
}

function resetMerge(entites: Tile[][]) {
    entites.forEach(tiles => tiles.forEach(tile => tile.resetMerged()));
}

export const MOVE_HANDLER: { [x: number]: (entry: Tile[][]) => Observable<any> } = {
    [Direction.UP]: (rows: Tile[][]): Observable<any> => {
        resetMerge(rows);
        const operands = [[rows[1], rows[0]], [rows[2], rows[1], rows[0]], [rows[3], rows[2], rows[1], rows[0]]];
        return merge(operands);
    },
    [Direction.DOWN]: (rows: Tile[][]): Observable<any> => {
        resetMerge(rows);
        const operands = [[rows[2], rows[3]], [rows[1], rows[2], rows[3]], [rows[0], rows[1], rows[2], rows[3]]];
        return merge(operands);
    },
    [Direction.LEFT]: (columns: Tile[][]): Observable<any> => {
        resetMerge(columns);
        const operands = [[columns[1], columns[0]], [columns[2], columns[1], columns[0]], [columns[3], columns[2], columns[1], columns[0]]];
        return merge(operands);
    },
    [Direction.RIGHT]: (columns: Tile[][]): Observable<any> => {
        resetMerge(columns);
        const operands = [[columns[2], columns[3]], [columns[1], columns[2], columns[3]], [columns[0], columns[1], columns[2], columns[3]]];
        return merge(operands);
    }
};