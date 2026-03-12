import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Asset } from '../../../services/asset';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-insert',
  imports: [ReactiveFormsModule],
  templateUrl: './insert.html',
  styleUrl: './insert.scss',
})
export class Insert {
  activeModal = inject(NgbActiveModal);
  private fb = inject(FormBuilder);
  private assetService = inject(Asset);

  insertForm = this.fb.group({
    asset_code: [''],
    category: ['資訊資產'],
    asset_name: [''],
    confidentiality: [1],
    integrity: [1],
    availability: [1],
    asset_value: [3],
    asset_level: [1],
    security_level: [1],
    owner: [''],
  });

  risks: any[] = [
    {
      id: 1,
      risk_no: 1,
      threat: '資料外洩',
      vulnerability: '權限控管不足',
      description: '',
      c_impact: 1,
      i_impact: 0,
      a_impact: 0,
      impact_level: 1,
      likelihood: 1,
      risk_value: 1
    },
    {
      id: 2,
      risk_no: 2,
      threat: '資料竄改',
      vulnerability: '權限控管不足',
      description: '',
      c_impact: 1,
      i_impact: 0,
      a_impact: 0,
      impact_level: 1,
      likelihood: 1,
      risk_value: 1
    }
  ];

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
    this.updateAllRiskValues();
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

  onImpactChange(
    risk: any,
    key: 'c_impact' | 'i_impact' | 'a_impact',
    event: Event
  ): void {
    const checked = (event.target as HTMLInputElement).checked;
    risk[key] = checked ? 1 : 0;
    this.updateRiskValue(risk);
  }

  onRiskFieldChange(
    risk: any,
    key: 'impact_level' | 'likelihood',
    event: Event
  ): void {
    const value = Number((event.target as HTMLSelectElement).value);
    risk[key] = value;
    this.updateRiskValue(risk);
  }

  updateRiskValue(risk: any): void {
    const impact = Number(risk.impact_level ?? 0);
    const likelihood = Number(risk.likelihood ?? 0);
    risk.risk_value = impact * likelihood;
  }

  updateAllRiskValues(): void {
    this.risks.forEach(risk => this.updateRiskValue(risk));
  }

  onSubmit(): void {
    const formValue = this.insertForm.getRawValue();

    const model = {
      asset_code: formValue.asset_code ?? '',
      category: formValue.category ?? '',
      asset_name: formValue.asset_name ?? '',
      confidentiality: Number(formValue.confidentiality),
      integrity: Number(formValue.integrity),
      availability: Number(formValue.availability),
      asset_value: Number(formValue.asset_value),
      asset_level: Number(formValue.asset_level),
      security_level: Number(formValue.security_level),
      owner: formValue.owner ?? '',
      risks: this.risks.map((risk: any) => ({
        risk_no: risk.risk_no,
        threat: risk.threat,
        vulnerability: risk.vulnerability,
        description: risk.description ?? '',
        c_impact: Number(risk.c_impact),
        i_impact: Number(risk.i_impact),
        a_impact: Number(risk.a_impact),
        impact_level: Number(risk.impact_level ?? 0),
        likelihood: Number(risk.likelihood ?? 0),
        risk_value: Number(risk.risk_value ?? 0)
      }))
    };

    console.log('新增資料', model);

    this.assetService.createAsset(model).subscribe({
      next: () => {
        alert('新增成功');
        this.activeModal.close(true);
      },
      error: (err) => {
        console.error('新增失敗', err);
        alert('新增失敗');
      }
    });
  }
}