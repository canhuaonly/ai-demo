import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InterfaceService } from './interface.api';

@Component({
  selector: 'app-interface',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './interface.component.html',
  styleUrl: './interface.component.css'
})


export class InterfaceComponent implements OnInit {

  constructor(private interfaceService: InterfaceService) { }

  listRtn = ''
  
  wenxinRtn = ''

  ngOnInit() {
    // this.init();
  }

  getList() {
    console.log('getList click')
    this.interfaceService.listApi({}).subscribe({
      next: res => {
        this.listRtn = JSON.stringify(res);
        console.log(this.listRtn)
      },
      error: error => this.listRtn = JSON.stringify(error),
      complete: () => console.log('Interface getRequired Completed!')
    });
  }

  wenxinChat() {
    console.log('wenxinChat click')
    let param = {
      content: '你是文心一言吗？'
    }
    this.interfaceService.wenxinApi(param).subscribe({
      next: res => {
        this.wenxinRtn = JSON.stringify(res);
        console.log(this.wenxinRtn)
      },
      error: error => this.wenxinRtn = JSON.stringify(error),
      complete: () => console.log('Interface getRequired Completed!')
    });
  }
}
