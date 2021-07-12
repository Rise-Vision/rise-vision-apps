import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutoSaveService {
  static readonly MINIMUM_INTERVAL_BETWEEN_SAVES = 5000;
  static readonly MAXIMUM_INTERVAL_BETWEEN_SAVES = 20000;

  _lastSavedTimestamp = 0;
  _saveTimeout = null;
  _saving = false;

  constructor(private saveFunction: Function) { }

  _getCurrentTimestamp() {
    return new Date().getTime();
  };

  _programSave() {
    this._saveTimeout = setTimeout(() => {
      this._saveTimeout = null;

      // if a previous save hasn't finished, give more time
      if (this._saving) {
        this._programSave();
      } else {
        this._lastSavedTimestamp = this._getCurrentTimestamp();
        this._saving = true;

        this.saveFunction().finally(() => {
          this._saving = false;
        });
      }
    }, AutoSaveService.MINIMUM_INTERVAL_BETWEEN_SAVES);
  };

  _reprogramSave() {
    this.clearSaveTimeout();
    this._programSave();
  };

  clearSaveTimeout() {
    if (this._saveTimeout) {
      clearTimeout(this._saveTimeout);
      this._saveTimeout = null;
    }
  };

  save() {
    if (this._saveTimeout) {
      var elapsed = this._getCurrentTimestamp() - this._lastSavedTimestamp;

      if (elapsed < AutoSaveService.MAXIMUM_INTERVAL_BETWEEN_SAVES) {
        this._reprogramSave();
      }
    } else {
      this._programSave();
    }
  };
}
