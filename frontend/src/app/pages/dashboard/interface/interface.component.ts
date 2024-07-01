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

}
