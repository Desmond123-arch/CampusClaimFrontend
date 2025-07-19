import { Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  standalone: false,
})
export class IntroPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  getStarted(){
    console.log("Hello")
    this.router.navigateByUrl('/auth/register', {replaceUrl: false})
  }
}
