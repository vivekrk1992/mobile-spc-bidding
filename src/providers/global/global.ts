import { Injectable } from '@angular/core';

@Injectable()
export class GlobalProvider {
  private _bag_quantity = 50;
  private _base_url: string = 'http://127.0.0.1:8001/';

  get bag_quantity() {
    return this._bag_quantity
  }

  get base_url() {
    return this._base_url;
  }
}
