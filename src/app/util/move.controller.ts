// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/from';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/delay';
// import 'rxjs/add/operator/mergeMap';
// import 'rxjs/add/operator/pairwise';

import { Direction } from '../models/direction';
import { Tile } from '../models/tile.model';
import { from, Observable, of } from 'rxjs';
import { mergeMap, pairwise, delay, map } from 'rxjs/operators';

// to merge the  tiles 
function mergeTiles(operands: Tile[][][]): Observable<any> {
    // return Observable.from(operands)
    //     .mergeMap(operand => {
    //         let delayTime = 0;
    //         return Observable.from(operand).pairwise().mergeMap(pair => {
    //             delayTime += 50;
    //             return Observable.of(pair).delay(delayTime);
    //         });
    //     })
    //     .map(([op1, op2]) => calculateScores(op2, op1));

    return from(operands)
        .pipe(
            mergeMap(operand => {
                let delayTime = 0;
                return from(operand).pipe(
                    pairwise(),
                    mergeMap(pair => {
                        delayTime += 50;
                        return of(pair).pipe(delay(delayTime));
                    })
                );
            }),
            map(([op1, op2]) => calculateScores(op2, op1))
        );
}

// calculates score after merging the tiles
function calculateScores(entry1: Tile[], entry2: Tile[]): number {
    let mergeScore = 0;
    if (entry1[0].merge(entry2[0])) mergeScore += entry1[0].value;
    if (entry1[1].merge(entry2[1])) mergeScore += entry1[1].value;
    if (entry1[2].merge(entry2[2])) mergeScore += entry1[2].value;
    if (entry1[3].merge(entry2[3])) mergeScore += entry1[3].value;
    return mergeScore;
}

// reset the merged tiles
function resetMergedTiles(entites: Tile[][]) {
    entites.forEach(tiles => tiles.forEach(tile => tile.resetMerged()));
}

// handles the move of the player by merging tiles
export const MOVE_CONTROLLER: { [x: number]: (entry: Tile[][]) => Observable<any> } = {
    [Direction.UP]: (rows: Tile[][]): Observable<any> => {
        resetMergedTiles(rows);
        const operands = [[rows[1], rows[0]], [rows[2], rows[1], rows[0]], [rows[3], rows[2], rows[1], rows[0]]];
        return mergeTiles(operands);
    },
    [Direction.DOWN]: (rows: Tile[][]): Observable<any> => {
        resetMergedTiles(rows);
        const operands = [[rows[2], rows[3]], [rows[1], rows[2], rows[3]], [rows[0], rows[1], rows[2], rows[3]]];
        return mergeTiles(operands);
    },
    [Direction.LEFT]: (columns: Tile[][]): Observable<any> => {
        resetMergedTiles(columns);
        const operands = [[columns[1], columns[0]], [columns[2], columns[1], columns[0]], [columns[3], columns[2], columns[1], columns[0]]];
        return mergeTiles(operands);
    },
    [Direction.RIGHT]: (columns: Tile[][]): Observable<any> => {
        resetMergedTiles(columns);
        const operands = [[columns[2], columns[3]], [columns[1], columns[2], columns[3]], [columns[0], columns[1], columns[2], columns[3]]];
        return mergeTiles(operands);
    }
};