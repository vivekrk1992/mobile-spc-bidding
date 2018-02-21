import { Injectable } from '@angular/core';

@Injectable()
export class GlobalProvider {
  private _bag_quantity = 50;

  get bag_quantity() {
    return this._bag_quantity
  }
}
