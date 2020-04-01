import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { element } from 'protractor';

@Component({
  selector: 'xb-authen-layout',
  templateUrl: './authen-layout.component.html',
  styleUrls: ['./authen-layout.component.scss']
})
export class AuthenLayoutComponent implements OnInit, AfterViewInit {
  cardState: boolean = false;
  stepperIndex = 0;

  shapes: Array<any> = [];
  frameCounter: number;
  requestAnimation: any;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.shapes = Array.from(document.getElementsByClassName('login__background')[0].getElementsByTagName('svg'));
    this.shapes.push(document.getElementsByClassName('login__background--before')[0]);
    this.shapes.push(document.getElementsByClassName('login__background--after')[0]);
  }

  @HostListener('document:mousemove', ['$event'])
    onMousemovenHandler(event: MouseEvent) {
      if (this.requestAnimation){
      window.cancelAnimationFrame(this.requestAnimation);
      }
      this.frameCounter = 0;
      this.requestAnimation = window.requestAnimationFrame(this.frameCallback(event));
    }

  frameCallback(event) {
    const componentReference = this;
    return function() {
      const x =  event.clientX;
      const y =  event.clientY;

      componentReference.shapes.forEach((element: HTMLElement) => {
        const speed = Number.parseFloat(element.dataset.speed) || 0.01;
        let newX = ((x - window.innerWidth / 2) + (componentReference.frameCounter / 30)) * speed;
        let newY = ((y - window.innerHeight / 2) + (componentReference.frameCounter / 30)) * speed;
        if (element.dataset.revert) {
          newX *= -1;
          newY *= -1;
        }

        element.style.transform = `translate(${1 - newX}px, ${1 - newY}px)`;
      });
      componentReference.frameCounter++;
      // if (componentReference.frameCounter < 120) {
      //   window.requestAnimationFrame(componentReference.frameCallback(event));
      // }
    }
  }

  public openCardBack() {
    this.cardState = true;
  }

  public closeCardBack() {
      this.cardState = false;
  }

  public onClickNext() {
      this.stepperIndex++;
  }

  public onClickBack() {
      this.stepperIndex--;
  }

  public transformCardBack() {
    let cssclasses = `login__form__card-back--active-item-${this.stepperIndex}`;
    if  (this.cardState) {
      cssclasses += ' login__form__card-back--active';
    }
    return cssclasses;
  }
}
