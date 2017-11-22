/* tslint:disable:max-line-length */
/**
 * Test Swagger
 * example.com/swagger
 */

import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import * as model from '../model';

export interface ProductsParams {
  stringField?: string;
  /** format: int32 */
  int32Field?: number;
  BooleanField?: boolean;
  /** format: int64 */
  longField?: number;
  floatField?: number;
  doubleField?: number;
  /** format: byte */
  byteField?: string;
  /** format: binary */
  binaryField?: string;
  /** format: date */
  dateField?: string;
  /** format: date-time */
  dateTimeField?: string;
}

@Injectable()
export class ProductsService {
  constructor(private http: HttpClient) {}

  /**
   * Get all products
   * http://example.com/swagger/swagger-ui.html#!/Products/Products
   */
  products(params: ProductsParams): Observable<model.Products> {
    const queryParams = new HttpParams()
    .set('stringField', params.stringField)
    .set('int32Field', JSON.stringify(params.int32Field))
    .set('BooleanField', JSON.stringify(params.BooleanField))
    .set('longField', JSON.stringify(params.longField))
    .set('floatField', JSON.stringify(params.floatField))
    .set('doubleField', JSON.stringify(params.doubleField))
    .set('byteField', params.byteField)
    .set('binaryField', params.binaryField)
    .set('dateField', params.dateField)
    .set('dateTimeField', params.dateTimeField);
    return this.http.get<model.Products>(`/api/products`, {params: queryParams});
  }
}
