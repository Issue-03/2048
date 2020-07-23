import { EventEmitter } from '@angular/core';

export class Tile {
    _value: number = null;
    success: EventEmitter<boolean> = new EventEmitter<boolean>();
    wasTileMerged: boolean = false;

    // Getters
    get value() { return this._value; }

    get isEmpty(): boolean { return this.value === null; }

    // Setters
    set value(value: number) {
        if (value == 2048) this.success.emit(true);
        this._value = value;
    }

    // set merged status on single tile
    merge(tile: Tile): boolean {
        let value = tile.value;
        if (!value || this.wasTileMerged || tile.wasTileMerged) return false;
        if (this.value && this.value !== value) return false;
        if (this.value) {
            this.value += value;
            this.wasTileMerged = true;
        } else {
            this.value = value;
        }
        tile.value = null;
        return true;
    }

    // reset merge status
    resetMerged() {
        this.wasTileMerged = false;
    }
}