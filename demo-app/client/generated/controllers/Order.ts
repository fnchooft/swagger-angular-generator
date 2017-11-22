/* tslint:disable:max-line-length */
/**
 * Test Swagger
 * example.com/swagger
 */

import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import * as model from '../model';

export interface OrderParams {
  /** order */
  orderDto: model.OrderDto;
  producer?: string;
}

@Injectable()
export class OrderService {
  constructor(private http: HttpClient) {}

  /**
   * create order
   * http://example.com/swagger/swagger-ui.html#!/Order/Order
   */
  order(params: OrderParams): Observable<object> {
    const bodyParams = params.orderDto;
    const queryParams = new HttpParams()
    .set('producer', params.producer);
    return this.http.post<object>(`/api/order`, bodyParams, {params: queryParams});
  }
}
