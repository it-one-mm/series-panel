import { NgModule } from '@angular/core';
import { NzTableModule, NzDrawerModule, NzButtonModule, NzFormModule, NzInputModule, NzDividerModule, NzSpinModule, NzMessageModule, NzPopconfirmModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NzTableModule,
        NzDrawerModule,
        NzButtonModule,
        NzFormModule,
        NzInputModule,
        NzDividerModule,
        NzSpinModule,
        NzMessageModule,
        NzPopconfirmModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NzTableModule,
        NzDrawerModule,
        NzButtonModule,
        NzFormModule,
        NzInputModule,
        NzDividerModule,
        NzSpinModule,
        NzMessageModule,
        NzPopconfirmModule,
    ]
})
export class ShareModule {}