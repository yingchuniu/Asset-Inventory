import { Component, inject, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Asset, EditAssetRequest, RiskModel } from '../../../services/asset';

@Component({
  selector: 'app-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.scss',
})
export class Edit {
  @Input() EditModel?: AssetEdit
  activeModal = inject(NgbActiveModal);

  private fb = inject(FormBuilder);
  private assetService = inject(Asset);
  Risk: RiskModel[] = [];

  insertForm = this.fb.group({
    confidentiality: [1],
    asset_code: [''],
    integrity: [1],
    availability: [1],
    asset_value: [3],
    asset_level: [1],
    security_level: [''],
    threat: [''],
    vulnerability: [''],
    owner: [''],
    risk_value: [0],

    // 威脅1
    threat1: [''],
    vulnerability1: [''],
    desc1: [''],
    c1: [false],
    i1: [false],
    a1: [false],

    // 威脅2
    threat2: [''],
    vulnerability2: [''],
    desc2: [''],
    c2: [false],
    i2: [false],
    a2: [false],
  });

  assetId!: number;
  risks: RiskModel[] = [];

  ngOnInit(): void {
    this.insertForm.get('confidentiality')?.valueChanges.subscribe(() => {
      this.updateAssetValue();
    });

    this.insertForm.get('integrity')?.valueChanges.subscribe(() => {
      this.updateAssetValue();
    });

    this.insertForm.get('availability')?.valueChanges.subscribe(() => {
      this.updateAssetValue();
    });

    this.updateAssetValue();

    if (this.EditModel?.id) {
      this.GetAssetById();
    }
  }



  updateAssetValue(): void {
    const c = Number(this.insertForm.get('confidentiality')?.value || 0);
    const i = Number(this.insertForm.get('integrity')?.value || 0);
    const a = Number(this.insertForm.get('availability')?.value || 0);

    const total = c + i + a;

    this.insertForm.patchValue(
      {
        asset_value: total,
        asset_level: total >= 13 ? 5 : total >= 10 ? 4 : total >= 7 ? 3 : total >= 4 ? 2 : 1
      },
      { emitEvent: false }
    );
  }

  GetAssetById() {
    if (!this.EditModel?.id) return;

    this.assetService.GetAssetById(this.EditModel.id).subscribe({
      next: (res: any) => {
              this.risks = (res.risks ?? []).map((risk: any) => ({
        ...risk,
        c_impact: Number(risk.c_impact),
        i_impact: Number(risk.i_impact),
        a_impact: Number(risk.a_impact),
        impact_level: Number(risk.impact_level ?? 0),
        likelihood: Number(risk.likelihood ?? 0),
        risk_value: Number(risk.risk_value ?? 0)
      }));

        console.log(this.risks)
        this.insertForm.patchValue({
          security_level: res.security_level,
          asset_code: res.asset_code,
          confidentiality: res.confidentiality,
          owner: res.owner,
          integrity: res.integrity,
          availability: res.availability,
          asset_value: res.asset_value,
          asset_level: res.asset_level,

        });
      },
      error: (err) => {
        console.error('載入資產資料失敗', err);
      }
    });


  }
  onImpactChange(risk: any, key: 'c_impact' | 'i_impact' | 'a_impact', event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    risk[key] = checked ? 1 : 0;

  }

  onRiskFieldChange(risk: any, key: 'impact_level' | 'likelihood', event: Event): void {
  const value = Number((event.target as HTMLSelectElement).value);
  risk[key] = value;
  risk.risk_value = Number(risk.impact_level) * Number(risk.likelihood);
}
  onSubmit(): void {

    if (!this.EditModel?.id) {
      console.error("找不到資產 id");
      return;
    }



    const formValue = this.insertForm.getRawValue();

    const model: EditAssetRequest = {
      id: this.EditModel.id,

      asset_code: formValue.asset_code ?? "",
      category: this.EditModel.category,
      asset_name: this.EditModel.asset_name,

      confidentiality: Number(formValue.confidentiality),
      integrity: Number(formValue.integrity),
      availability: Number(formValue.availability),

      asset_value: Number(formValue.asset_value),
      asset_level: Number(formValue.asset_level),
      security_level: Number(formValue.security_level),

      owner: formValue.owner ?? "",

      risks: this.risks.map((risk: any) => ({
        id: risk.id,
        asset_id: risk.asset_id,
        risk_no: risk.risk_no,

        threat: risk.threat,
        vulnerability: risk.vulnerability,
        description: risk.description ?? '',

        c_impact: Number(risk.c_impact) === 1 ? 1 : 0,
        i_impact: Number(risk.i_impact) === 1 ? 1 : 0,
        a_impact: Number(risk.a_impact) === 1 ? 1 : 0,


        impact_level: Number(risk.impact_level ?? 0),
        likelihood: Number(risk.likelihood ?? 0),
        risk_value: Number(risk.risk_value ?? 0)
      }))
    };

    console.log("送出資料", model);

    this.assetService.EditAsset(model).subscribe({
      next: () => {
        alert("修改成功");
        this.activeModal.close(true);
      },
      error: (err) => {
        console.error("修改失敗", err);
        alert("修改失敗");
      }
    });

  }
}
export interface AssetEdit {
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


}

