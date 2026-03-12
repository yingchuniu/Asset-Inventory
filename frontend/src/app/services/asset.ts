import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Asset {
  http = inject(HttpClient)
  apiUrl = 'http://localhost:3000/api/assets'


  //查詢
  // GetAssets(): Observable<AssetModel[]> {
  //   return this.http.get(`${this.apiUrl}`) as Observable<AssetModel[]>
  // }

  GetAssets(keyword?: string) {
  if (keyword && keyword.trim()) {
    return this.http.get<AssetModel[]>(`${this.apiUrl}?keyword=${encodeURIComponent(keyword.trim())}`);
  }

  return this.http.get<AssetModel[]>(this.apiUrl);
}
  //單筆
  GetAssetById(id: number): Observable<AssetModel> {
    return this.http.get(`${this.apiUrl}/${id}`) as Observable<AssetModel>;
  }
  //編輯
  EditAsset(asset: EditAssetRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${asset.id}`, asset) as Observable<any>;
  }
  //刪除

  deleteAsset(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`) as Observable<string>
  }
  //新增
  createAsset(asset: CreateAssetRequest): Observable<AssetModel> {
    return this.http.post(`${this.apiUrl}`, asset) as Observable<AssetModel>
  }

}



export interface AssetModel {
  id: number;
  asset_code: string;
  category: string;
  asset_name: string;
  confidentiality: number;
  integrity: number;
  availability: number;
  asset_value: number;
  asset_level: number;
  security_level: number;
  owner: string;
}

export interface CreateRiskRequest {
  risk_no: number;
  threat: string;
  vulnerability: string;
  description: string;
  c_impact: number;
  i_impact: number;
  a_impact: number;
  impact_level: number;
  likelihood: number;
  risk_value: number;
}

export interface CreateAssetRequest {
  asset_code: string;
  category: string;
  asset_name: string;
  confidentiality: number;
  integrity: number;
  availability: number;
  asset_value: number;
  asset_level: number;
  security_level: number;
  owner: string;
  risks: CreateRiskRequest[];
}
export interface RiskModel {
  id?: number;
  asset_id: number;
  risk_no: number;
  threat: string;
  vulnerability: string;
  risk_value: number;
  impact_level: number
  likelihood: number
  description: string
  c_impact: number
  i_impact: number
  a_impact: number
}

export interface EditAssetRequest {
  id: number;
  asset_code: string;
  category: string;
  asset_name: string;
  confidentiality: number;
  integrity: number;
  availability: number;
  asset_value: number;
  asset_level: number;
  owner: string;
  security_level: number;
  risks: RiskModel[];
}
