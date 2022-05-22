import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
  @Input() config;
@Output() closeToast = new EventEmitter<void>();
  constructor() { }

  ngOnInit(): void {
    const _this = this;
    setTimeout(()=>{
      _this.closeToast.emit();
    },5000);
  }

}
