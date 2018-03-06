import { Injectable } from '@angular/core';

@Injectable()
export class GlobalProvider {
  private _bag_quantity = 50;
  private _base_url: string = 'http://192.168.0.109:8000/';

  get bag_quantity() {
    return this._bag_quantity
  }

  get base_url() {
    return this._base_url;
  }
}
